// AWS JS SDK TO RETRIVE SECRET/.ENV VARIABLES
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const secret_name = "postgrescredentials";

const client = new SecretsManagerClient({
  region: "eu-west-2",
});

let response;

const getSecretValues = async () => {
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

}
getSecretValues()


module.exports = response



