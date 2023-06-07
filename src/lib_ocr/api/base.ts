import * as dotenv from "dotenv";
dotenv.config();

import { SystemParameter } from "../../system-parameter";
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js";

type AzureOCRApiConfig = {
    endpointURL: string,
    keys: string[],
};

const baseApiConfig: AzureOCRApiConfig = {
    endpointURL: SystemParameter.getString("AZURE_VISION_ENDPOINT"),
    keys: [SystemParameter.getString("AZURE_VISION_KEY"), SystemParameter.getString("AZURE_VISION_KEY2")]
};

const cognitiveServicesCredentials = new CognitiveServicesCredentials(baseApiConfig.keys[0]);
const client = new ComputerVisionClient(cognitiveServicesCredentials, baseApiConfig.endpointURL);

const url = "https://docs.microsoft.com/azure/includes/media/shared-image-galleries/shared-image-gallery.png";
const url2 = "https://images.pexels.com/photos/2432221/pexels-photo-2432221.jpeg?auto=compress&cs=tinysrgb&w=1200";

const options = {
    maxCandidates: 5,
    lenguage: 'en',
};

function main() {
    client
        .describeImage(url2, options)
        .then((result) => {
            console.log("The result is:");
            console.log(result);
        })
        .catch((e) => {
            console.log("An error occured:");
            console.log(e);
        });
};

main();