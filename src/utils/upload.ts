import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage';

export const uploadImageUser = async (file: Express.Multer.File) => {
  const storage = getStorage();
  const dateNow = new Date();
  const storageRef = ref(
    storage,
    `user/${file.originalname}-${dateNow.getTime()}`,
  );
  const metaData = {
    contentType: file.mimetype,
  };
  const snapshot = await uploadBytesResumable(
    storageRef,
    file.buffer,
    metaData,
  );
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
export const deleteImageUser = async (file: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, file);
  console.log(storageRef);

  const deleteImage = await deleteObject(storageRef)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);

      return false;
    });
  return deleteImage;
};
export const uploadImageMenu = async (file: Express.Multer.File) => {
  const storage = getStorage();
  const dateNow = new Date();
  const storageRef = ref(
    storage,
    `menu/${file.originalname}-${dateNow.getTime()}`,
  );
  const metaData = {
    contentType: file.mimetype,
  };
  const snapshot = await uploadBytesResumable(
    storageRef,
    file.buffer,
    metaData,
  );
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
export const deleteImageMenu = async (file: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, file);
  console.log(storageRef);

  const deleteImage = await deleteObject(storageRef)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);

      return false;
    });
  return deleteImage;
};
