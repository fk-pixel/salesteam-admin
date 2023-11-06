export default function createImageURLFromDrive(imgaeID) {
  const modifiedURL = `https://drive.google.com/uc?export=view&id=${imgaeID}`;
  return modifiedURL;
}
