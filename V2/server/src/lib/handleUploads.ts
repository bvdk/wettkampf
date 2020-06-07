import fetch from "node-fetch";

import cloudinary from "../config/cloudinary";

export function deleteUpload(url) {
  const publicId = url.split("/").slice(-3).join("/").split(".")[0];

  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(
      [publicId],
      { invalidate: true, type: "authenticated" },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
}

export function deleteUserUploads(profileId) {
  const prefix = `${process.env.NODE_ENV}/${profileId}`;

  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources_by_prefix(
      prefix,
      { invalidate: true, type: "authenticated" },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
}

export function deleteUserUploadsDir(profileId) {
  return fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/folders/${process.env.NODE_ENV}/${profileId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`
        ).toString("base64")}`,
      },
    }
  );
}

function onReadStream(stream) {
  return new Promise((resolve, reject) => {
    const buffers = [];
    stream.on("error", (error) => reject(error));
    stream.on("data", (data) => buffers.push(data));
    stream.on("end", () => {
      const contents = Buffer.concat(buffers);
      resolve(contents);
    });
  });
}

export async function readNestedFileStreams(variables) {
  const varArr = Object.entries(variables || {});

  const promises = varArr.map(async (elem) => {
    if (
      // @ts-ignore
      Boolean(elem[1] && elem[1].then && typeof elem[1].then === "function")
    ) {
      // @ts-ignore
      const { createReadStream, encoding, filename, mimetype } = await elem[1];
      const readStream = createReadStream();
      const buffer = await onReadStream(readStream);
      variables[elem[0]] = { buffer, encoding, filename, mimetype };
    }

    if (elem[1] !== null && elem[1].constructor.name === "Object") {
      await readNestedFileStreams(elem[1]);
    }
  });

  await Promise.all(promises);

  return variables;
}

export function uploadStream(buffer, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      })
      .end(buffer);
  });
}
