import { Stack, StackProps } from 'aws-cdk-lib'
import { Vpc } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'
import { TinyproxyServer } from './tinyproxy'

export class CdkTinyproxyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const vpc = Vpc.fromLookup(this, 'TinyproxyServerVpc', {
      isDefault: true,
    })

    new TinyproxyServer(this, 'TinyproxyServer', {
      vpc,
    })
  }
}
