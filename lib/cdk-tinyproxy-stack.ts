import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { Vpc } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'
import { TinyproxyServer } from './tinyproxy'

interface CdkTinyproxyStackProps extends StackProps {
  allowedIps: string[]
}

export class CdkTinyproxyStack extends Stack {
  constructor(scope: Construct, id: string, props: CdkTinyproxyStackProps) {
    super(scope, id, props)

    const { allowedIps } = props

    const vpc = Vpc.fromLookup(this, 'TinyproxyServerVpc', {
      isDefault: true,
    })

    const tinyproxyServer = new TinyproxyServer(this, 'TinyproxyServer', {
      vpc,
      allowedIps,
    })

    new CfnOutput(this, 'PublicIp', {
      value: tinyproxyServer.instance.instancePublicIp,
      description: 'Public IP of the Tinyproxy server',
    })
  }
}
