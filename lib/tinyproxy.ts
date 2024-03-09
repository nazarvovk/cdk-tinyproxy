import { Duration, Stack } from 'aws-cdk-lib'
import {
  CloudFormationInit,
  IVpc,
  InitCommand,
  InitFile,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  SecurityGroup,
} from 'aws-cdk-lib/aws-ec2'
import { Construct, IConstruct } from 'constructs'
import { TinyproxyServerSecurityGroup } from './security-group'

interface TinyproxyServerProps {
  vpc: IVpc
  allowedIps: string[]
}

export class TinyproxyServer extends Construct {
  public instance: Instance
  public securityGroup: SecurityGroup

  constructor(scope: IConstruct, id: string, props: TinyproxyServerProps) {
    super(scope, id)

    const { vpc, allowedIps } = props

    const stack = Stack.of(this)

    this.securityGroup = new TinyproxyServerSecurityGroup(this, 'SecurityGroup', {
      vpc,
      allowedIps,
    })

    const machineImage = MachineImage.genericLinux({
      [stack.region]: 'ami-04dfd853d88e818e8', // ubuntu-jammy-22.04-amd64-server-20240207.1
    })

    const init = CloudFormationInit.fromElements(
      InitFile.fromString(
        '/etc/cfn/cfn-hup.conf',
        ['[main]', `stack=${stack.stackName}`, `region=${stack.region}`].join('\n'),
        {
          mode: '000400',
          owner: 'root',
          group: 'root',
        },
      ),
      InitFile.fromString(
        '/etc/cfn/hooks.d/cfn-auto-reloader.conf',
        [
          '[cfn-auto-reloader-hook]',
          'triggers=post.update',
          'path=Resources.WebServerInstance.Metadata.AWS::CloudFormation::Init',
          `action=/usr/local/bin/cfn-init -v --stack ${stack.stackName} --resource WebServerInstance --region ${stack.region}`,
          'runas=root',
        ].join('\n'),
        {
          mode: '000400',
          owner: 'root',
          group: 'root',
        },
      ),
      InitFile.fromString(
        '/lib/systemd/system/cfn-hup.service',
        [
          '[Unit]',
          'Description=cfn-hup daemon',
          '',
          '[Service]',
          'Type=simple',
          '',
          'ExecStart=/usr/local/bin/cfn-hup',
          '',
          'Restart=always',
          '',
          '[Install]',
          'WantedBy=multi-user.target',
        ].join('\n'),
      ),
      InitCommand.shellCommand('systemctl enable cfn-hup.service'),
      InitCommand.shellCommand('systemctl start cfn-hup.service'),

      // install tinyproxy
      InitCommand.shellCommand('sudo apt-get update -y'),
      InitCommand.shellCommand('sudo apt-get upgrade -y'),
      InitCommand.shellCommand('sudo apt-get install -y tinyproxy'),
      ...allowedIps.map((ip) =>
        InitCommand.shellCommand(
          `sudo sh -c 'echo "Allow ${ip}" >> /etc/tinyproxy/tinyproxy.conf'`,
        ),
      ),
      InitCommand.shellCommand('sudo /etc/init.d/tinyproxy restart'),
    )

    this.instance = new Instance(this, 'UbuntuInstance', {
      instanceName: 'Ubuntu Tinyproxy',
      vpc,
      securityGroup: this.securityGroup,
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.NANO),
      machineImage,
      associatePublicIpAddress: true,
      initOptions: {
        timeout: Duration.minutes(10),
      },
      init,
    })

    // run the cfn-init (the configured files and commands above)
    this.instance.addUserData(
      'sudo apt-get update -y',
      'sudo apt-get -y install python3-pip',
      'mkdir -p /opt/aws/',
      'sudo pip3 install https://s3.amazonaws.com/cloudformation-examples/aws-cfn-bootstrap-py3-latest.tar.gz',
      'sudo ln -s /usr/local/init/ubuntu/cfn-hup /etc/init.d/cfn-hup',
      `/usr/local/bin/cfn-init -v --stack ${stack.stackName} --resource ${this.instance.instance.logicalId} --region ${stack.region}`,
      `/usr/local/bin/cfn-signal -e $? --stack ${stack.stackName} --resource ${this.instance.instance.logicalId} --region ${stack.region}`,
    )
  }
}
