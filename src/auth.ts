import { writeFileSync } from "fs";
import {
  getInput,
  info,
  exportVariable,
  startGroup,
  endGroup,
} from "@actions/core";
import * as path from 'path'

export const login = async () => {
  startGroup("Firebase Authentication");
  let key = getInput("gcp_sa_key");
  const token = getInput("firebase_token");

  if (!key && !token) {
    throw new Error(
      "Either firebase_token or gcp_sa_key are required to authenticate firebase-tools"
    );
  }

  if (token) {
    info("Setting firebase token for use by CLI");
    await exportVariable("FIREBASE_TOKEN", token);
  }

  if (key) {
    const pattern =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if (pattern.test(key)) {
      const buffer = Buffer.from(key, "base64");
      key = buffer.toString("ascii");
    }
    let keyFilename = "/tmp/gcp_key.json";
    info("Storing service account key into /tmp/gcp_key.json");
    writeFileSync(keyFilename, key);
    await exportVariable("GOOGLE_APPLICATION_CREDENTIALS", keyFilename);
  }

  endGroup();
};
