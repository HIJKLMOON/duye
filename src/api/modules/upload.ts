export const uploadApi = {
  upload: (file: File, onProgress?: (percent: number) => void) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      xhr.open("POST", `${import.meta.env.VITE_API_BASE_URL || "/api"}/upload`);

      const token = localStorage.getItem("token");
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error"));
      };

      xhr.send(formData);
    });
  },

  uploadChunk: (
    file: File,
    onProgress?: (percent: number) => void,
    chunkSize: number = 1024 * 1024,
  ) => {
    return new Promise((resolve, reject) => {
      const totalChunks = Math.ceil(file.size / chunkSize);
      let uploadedChunks = 0;

      const uploadNextChunk = (chunkIndex: number) => {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("filename", file.name);
        formData.append("chunkIndex", String(chunkIndex));
        formData.append("totalChunks", String(totalChunks));

        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `${import.meta.env.VITE_API_BASE_URL || "/api"}/upload/chunk`,
        );

        const token = localStorage.getItem("token");
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const chunkProgress = (event.loaded / event.total) * 100;
            const totalProgress =
              ((uploadedChunks + chunkProgress / 100) / totalChunks) * 100;
            onProgress(Math.round(totalProgress));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            uploadedChunks++;
            if (uploadedChunks < totalChunks) {
              uploadNextChunk(uploadedChunks);
            } else {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            }
          } else {
            reject(new Error("Chunk upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      };

      uploadNextChunk(0);
    });
  },
};
