// AWS JS SDK TO RETRIVE SECRET/.ENV VARIABLES

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "postgrescredentials";

const client = new SecretsManagerClient({
  region: "eu-west-2",
});

let response;

try {
  response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
    })
  );
} catch (error) {
  throw error;
}


module.exports = response



