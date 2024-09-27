import { publicIpv4 } from 'public-ip';
import { info, getInput, setFailed } from '@actions/core';
import { EC2Client, RevokeSecurityGroupIngressCommand, RevokeSecurityGroupIngressCommandInput } from '@aws-sdk/client-ec2';

async function post() {
    try {
        const ip = await publicIpv4();
        info(`Public IP: ${ip}`);

        const awsAccessKeyId = getInput('aws-access-key-id');
        const awsSecretAccessKey = getInput('aws-secret-access-key');
        const awsRegion = getInput('aws-region');

        info(`AWS Access Key ID: ${awsAccessKeyId}`);
        info(`AWS Secret Access Key: ${awsSecretAccessKey}`);
        info(`AWS Region: ${awsRegion}`);

        if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion) {
            setFailed('AWS credentials or region not provided');
            return;
        }

        const ec2Client = new EC2Client({
            credentials: {
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey,
            },
            region: awsRegion
        });

        const groupId = getInput('aws-security-group-id');
        const protocol = getInput('protocol');
        const port = getInput('port');
        const toPort = getInput('to-port');

        const params: RevokeSecurityGroupIngressCommandInput = {
            GroupId: groupId,
            IpPermissions: [{
                IpProtocol: protocol,
                FromPort: Number(port),
                ToPort: Number(toPort ? toPort : port),
                IpRanges: [{ CidrIp: `${ip}/32` }],
            }]
        };

        const command = new RevokeSecurityGroupIngressCommand(params);
        const res = await ec2Client.send(command);

        info(`IP ${ip} removed from security group ${groupId}`);

        info(JSON.stringify(res));
    }
    catch (error) {
        if (error instanceof Error) {
            setFailed(error.message);
        }
        else {
            setFailed(`Unknown error: ${error}`);
        }
    }
}

post();