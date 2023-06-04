import multer from 'multer'
import { v4 as uuid } from 'uuid'
import ApiError from '../Exceptions/ApiError'

const whitelist = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
]

const storageImages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './storage/images')
  },
  filename: function (req, file, cb) {
    cb(null, `${uuid()}.${file.originalname.split('.').at(-1)}`)
  }
})

const storageFiles = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './storage/files')
  },
  filename: function (req, file, cb) {
    cb(null, `${uuid()}.${file.originalname.split('.').at(-1)}`)
  }
})

export const uploadAvatar = multer({ 
  storage: storageImages, 
  limits: { fieldSize: 1048576 }, // 10mb
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(ApiError.BadRequest('INVALID_FILE_EXTENSION'))
    }

    cb(null, true)
  }
}).single('image')

export const uploadFiles = multer({ 
  storage: storageFiles, 
  limits: { fieldSize: 3145728 } // 30mb
}).array('files', 10)