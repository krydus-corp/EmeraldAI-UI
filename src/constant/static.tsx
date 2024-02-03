export const AUTH_TOKEN = 'token';
export const REFRESH_TOKEN = 'refresh-token';
export const SESSION_EXPIRED =
  'Your Session has expired. Please login to continue.';
export const JWT_MESSAGE = 'jwt expired';
export const JWT_MALFORM = 'jwt malformed';
export const SERVER_ALERT = 'Something went wrong. Please try again.';
export const INTERNET_CONNECTION = 'Please check your internet connection.';

export const UNSUPPORTED_IMG_FORMAT = 'Some files are in unsupported formats.';
export const LIMIT_EXCEED_5GB = 'Upload limit Exceeded, per upload 5GB.';
export const NAME = 'name';
export const PROJECT_ID = 'projectid';
export const DATASET_ID = 'datasetid';
export const CONTENT_ID = 'contentid';
export const PROJECT_NAME_REQUIRED='Project name is required!';
export const ANNOTATION_REQUIRED='Annotation type is required!';
export const ANNOTATE = 'annotate';
export const DATASET_UPDATE_SUCCESS = 'Dataset updated successfully';
export const DELETE_CLASS_SUCCESS = 'Class Deleted successfully';
export const HTTPS_REPLACE = 'https://';
export const CLASSIFICATION = 'classification';
export const MODEL_IMAGE_FILTER = false;
export const FIVE_GB_SIZE = 5368709120;
export const FIVE_HUNDRED_MB_SIZE = 524288000;
export const HUNDRED_MB_SIZE = 104857600;
export const SELECT_MANUALLY = {
  header: 'Select Manually?',
  contentOne: 'If you choose to select manually then all the images',
  contentTwo: 'you selected randomly will be unselected'
};
export const SELECT_RANDOMLY = {
  header: 'Select Randomly?',
  contentOne: 'If you choose to select randomly then all the images',
  contentTwo: 'you selected manually will be unselected'
};
export const TAG_NOT_SUBMITTED = {
  header: 'Classes not submitted',
  content: `The class you applied to the image aren't saved. Please submit to save or skip the image without saving classes`
};
export const MODEL_ACTION = {
  create: 'create',
  update: 'update',
  view: 'view'
};
export const MODEL_STATUS = {
  TRAINING: 'TRAINING',
  ERR:"ERR",
  INITIALIZED: 'INITIALIZED',
  TRAINED: 'TRAINED',
  CREATING: 'CREATING',
  DELETED: 'DELETED',
  DELETING: 'DELETING',
  COMPLETE: 'COMPLETE',
  RUNNING: 'RUNNING',
  COMPLETE_WITH_ERROR: 'COMPLETE_WITH_ERR'
};
export const HORIZONTAL = 'horizontal';
export const VERTICAL = 'vertical';
export const PREPROCESSING_OPTION = {
  resize: 'resize',
  stretch: 'stretch',
  fill: 'fill',
  fit: 'fit',
  static: 'static',
  isolate: 'isolate',
  tile: 'tile',
  filter_null: 'fillter_null'
};
export const AUGMENTATION_OPTION = {
  flip: 'flip',
  rotate: 'rotate',
  random_crop: 'random_crop',
  rotation: 'rotation',
  gaussian_blur: 'gaussian_blur',
  grayscale: 'grayscale',
  random_erasing: 'random_erasing',
  color_jitter: 'color_jitter',
  noise: 'noise',
  jpeg_compression: 'jpeg_compression'
};
export const ANNOTATION_SIZE = {
  TINY: 100,
  SMALL: 100,
  MEDIUM: 256,
  LARGE: 720,
  JUMBO: 1024
};
export const REPRESENTATION_STATE = {
  representationUnder: 'representation_under',
  representationOver: 'representation_over',
  representationBalanced: 'representation_balanced'
};
export const PROJECT_TYPE = {
  classification : 'Classification',
  bounding_box:'Bounding Box'
}

