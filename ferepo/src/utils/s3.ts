import AWS from 'aws-sdk';
import {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET,
} from '@env';

// 환경 변수 디버깅
console.log('🔍 환경 변수 확인:');
console.log('AWS_REGION:', AWS_REGION);
console.log('AWS_ACCESS_KEY_ID:', AWS_ACCESS_KEY_ID ? '설정됨' : '없음');
console.log('AWS_SECRET_ACCESS_KEY:', AWS_SECRET_ACCESS_KEY ? '설정됨' : '없음');
console.log('AWS_S3_BUCKET:', AWS_S3_BUCKET);

// AWS 설정 - 환경 변수 사용 (폴백 포함)
const awsConfig = {
  region: AWS_REGION || 'ap-northeast-2',
  accessKeyId: AWS_ACCESS_KEY_ID || 'AKIAY46M524FOT677GXA',
  secretAccessKey: AWS_SECRET_ACCESS_KEY || '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',
};

console.log('🔧 AWS 설정:', {
  region: awsConfig.region,
  accessKeyId: awsConfig.accessKeyId ? '설정됨' : '없음',
  secretAccessKey: awsConfig.secretAccessKey ? '설정됨' : '없음',
});

// 자격 증명이 없으면 에러 발생
if (!awsConfig.accessKeyId || !awsConfig.secretAccessKey) {
  console.error('❌ AWS 자격 증명이 설정되지 않았습니다!');
  throw new Error('AWS credentials not configured');
}

AWS.config.update(awsConfig);

const s3 = new AWS.S3();
const bucketName = AWS_S3_BUCKET || 'e207bucket';

// Presigned URL 생성 함수
export const createPresignedUrl = async (
  email: string,
  fileName: string,
  fileType: string,
): Promise<{ presignedUrl: string; fileUrl: string }> => {
  const key = `images/${email}/${fileName}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
    Expires: 3600, // 1시간
  };

  const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
  const fileUrl = `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/${key}`;

  return { presignedUrl, fileUrl };
};

// 이미지 업로드 함수 (간단한 방식 - 실제 업로드 없이 로컬 URI 반환)
export const uploadImage = async (
  email: string,
  imageUri: string,
  fileName: string,
  fileType: string = 'image/jpeg',
): Promise<string> => {
  try {
    console.log('📸 이미지 업로드 시작:', { email, fileName });
    console.log('📸 원본 이미지 URI:', imageUri);
    
    // 개발/테스트 환경에서는 원본 이미지 URI를 그대로 반환
    // 실제 프로덕션에서는 S3 업로드가 필요하지만, 현재는 CORS 문제로 인해 불가능
    console.log('✅ 개발 환경: 원본 이미지 URI 반환');
    return imageUri;
    
  } catch (error) {
    console.error('❌ 이미지 업로드 에러:', error);
    throw error;
  }
};
