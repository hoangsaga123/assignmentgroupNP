import fs from 'fs';
import path from 'path';


/**
 * Creates a folder in the public/img/users directory for the given user's email.
 * 
 * @param {string} email - The email of the user.
 * @returns {Promise<void>} - A promise that resolves when the folder is created.
 */

export function filterEmailFromUniqueCharacter(email) {
    return email.replace(/[^a-zA-Z0-9]/g, '_');
}

export function filterFileName(filename) {
  // Split the filename and extension
  const lastDotIndex = filename.lastIndexOf('.');
  
  // Get the name without the extension
  const nameWithoutExtension = lastDotIndex !== -1 ? filename.slice(0, lastDotIndex) : filename;
  const extension = lastDotIndex !== -1 ? filename.slice(lastDotIndex) : '';

  // Sanitize the name and preserve the extension
  const sanitizedFileName = nameWithoutExtension.replace(/[^a-zA-Z0-9]/g, '_').replace(/\s/g, '_');
  
  // Return the sanitized filename with its extension
  return sanitizedFileName + extension;
}
export async function createUserFolder(email) {
    try {
        const sanitizedEmail = filterEmailFromUniqueCharacter(email); // Sanitize email to be a valid folder name
        const __dirname = path.resolve(); // Get the root directory of the project
        const userFolderPath = path.resolve(__dirname, 'public', 'img', 'users', sanitizedEmail); // Absolute path to 'public/img/users'

        // Check if the folder exists, if not, create it
        try {
            await fs.promises.access(userFolderPath); // Check if the folder exists
        } catch (err) {
            // If it doesn't exist, create the folder
            await fs.promises.mkdir(userFolderPath, { recursive: true });
        }
    } catch (err) {
        console.error(`Error creating user folder: ${err.message}`);
        throw err; // Rethrow the error to be handled by the caller
    }
}

export async function deleteAllUserFolder() {
    try {
    const usersImgDir = path.join(import.meta.dirname, '../public/img/users');
    console.log(`Deleting all user images in ${usersImgDir}...`);
      if(fs.existsSync(usersImgDir)) {
        console.log(`Deleting all user images in ${usersImgDir}...`);
        await fs.promises.rm(usersImgDir, { recursive: true, force: true });
        console.log('All user images deleted successfully.');
      } else {
        console.log('Users images directory does not exist.');
      }
    } catch (error) {
      console.error('Error deleting user images:', error);
      throw error
    }
}

export function getUserImagePath(email) {
    const __dirname = path.resolve();
    const userDir = path.resolve(__dirname, 'public', 'img', 'users', email);
    return userDir;
}