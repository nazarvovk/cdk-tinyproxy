import { IVpc, Peer, Port, SecurityGroup } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'

interface TinyproxyServerSecurityGroupProps {
  vpc: IVpc
  allowedIps: string[]
}

export class TinyproxyServerSecurityGroup extends SecurityGroup {
  constructor(scope: Construct, id: string, props: TinyproxyServerSecurityGroupProps) {
    super(scope, id, {
      vpc: props.vpc,
      allowAllOutbound: true,
      description: 'Tinyproxy server security group',
    })

    for (const ip of props.allowedIps) {
      this.addIngressRule(
        Peer.ipv4(`${ip}/32`),
        Port.tcp(8888),
        `Allow inbound traffic on port 8888 from ${ip}`,
      )
    }
  }
}
