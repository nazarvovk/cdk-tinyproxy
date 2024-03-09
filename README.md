# CDK Tinyproxy

Simple CDK stack that deploys an EC2 instance running Tinyproxy.

Uses a minimal `t2.nano` instance type with Ubuntu. Super economical on resources & cost, and in my experience, it's been more than enough for personal use.

## Installation

I am using [`pnpm`](https://pnpm.io/) as the package manager.
As usual with node packages, you can use `npm`, `yarn` or whatever else.

```bash
pnpm install
```

## Usage

To deploy with AWS CDK, you'll need to have your AWS credentials set up in your environment. 

Run to deploy and start proxy:

```bash
pnpm cdk deploy
```

When the deployment is complete, you will see the public IP address of the EC2 instance in the output.
Use that IP address along with port `8888` to configure your browser or system proxy settings.

> NOTE: The proxy will be accessible only from the IP address you are deploying from. You can change this in the `bin/cdk-tinyproxy.ts` file.
>
> If your IP address changes, you'll need to re-deploy the stack.

To stop the proxy and destroy the stack:

```bash
pnpm cdk destroy
```
