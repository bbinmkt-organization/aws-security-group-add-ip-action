import { info, getInput, setFailed } from '@actions/core';
import { EC2Client, AuthorizeSecurityGroupIngressCommand, AuthorizeSecurityGroupIngressCommandInput } from '@aws-sdk/client-ec2';
import { publicIpv4 } from 'public-ip';

async function add() {
    const ip = await publicIpv4();

    info(`Public IP: ${ip}`);

    const awsAccessKeyId = getInput('aws-access-key-id');
    const awsSecretAccessKey = getInput('aws-secret-access-key');
    const awsRegion = getInput('aws-region');

    info(`AWS Access Key ID: ${awsAccessKeyId}`);
    info(`AWS Secret Access Key: ${awsSecretAccessKey}`);
    info(`AWS Region: ${awsRegion}`);

    if (!awsAccessKeyId || !awsSecretAccessKey) {
        setFailed('AWS credentials not provided');
        return;
    }
    if (!awsRegion) {
        setFailed('AWS region not provided');
        return;
    }

    const ec2Client = new EC2Client({
        credentials: {
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey,
        },
        region: awsRegion
    });

    const GroupId = getInput('aws-security-group-id');
    const port = getInput('port');
    const toPort = getInput('to-port');
    const protocol = getInput('protocol');
    const description = getInput('description');

    info(`Security Group ID: ${GroupId}`);
    info(`Port: ${port}`);
    info(`To Port: ${toPort}`);
    info(`Protocol: ${protocol}`);
    info(`Description: ${description}`);

    const params: AuthorizeSecurityGroupIngressCommandInput = {
        GroupId,
        IpPermissions: [
            {
                IpProtocol: protocol,
                FromPort: Number(port),
                ToPort: Number(toPort ? toPort : port),
                IpRanges: [{ CidrIp: `${ip}/32`, Description: description }],
            }
        ]
    };

    try {
        const command = new AuthorizeSecurityGroupIngressCommand(params);
        const data = await ec2Client.send(command);
        info(`IP ${ip} added to security group ${GroupId}`);
        info(JSON.stringify(data));
    } catch (error) {
        if (error instanceof Error) {
            setFailed(error.message);
        } else {
            setFailed(`Unknown error: ${error}`);
        }
    }
}

add();
