// @flow

export const formattedSize = (bytes: number) => {
  if (!bytes && bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + ' ' + sizes[i];
};

export const fullNameToInitials = (fullName: string) => {
  if (fullName.length > 1) {
    const [lastName, firstName, fatherName] = fullName.split(' ');
    return `${lastName} ${firstName ? firstName.substring(0, 1) + '.' : ''} ${fatherName ? fatherName.substring(0, 1) + '.' : ''}`;
  } else {
    return fullName;
  }
};