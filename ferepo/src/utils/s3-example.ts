import { uploadImage } from './s3';

// 사용 예시
export const uploadProfileImage = async (email: string, imageUri: string) => {
  try {
    const fileUrl = await uploadImage(
      email,
      imageUri,
      'profile.jpg',
      'image/jpeg',
    );

    console.log('업로드 성공:', fileUrl);
    return fileUrl;
  } catch (error) {
    console.error('업로드 실패:', error);
    throw error;
  }
};

export const uploadTimetableImage = async (email: string, imageUri: string) => {
  try {
    const fileUrl = await uploadImage(
      email,
      imageUri,
      'timetable.png',
      'image/png',
    );

    console.log('시간표 업로드 성공:', fileUrl);
    return fileUrl;
  } catch (error) {
    console.error('시간표 업로드 실패:', error);
    throw error;
  }
};

