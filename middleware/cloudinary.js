const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: (req,file) => {
        return {
            folder: "ApenteT-images",
            allowedFormats:["png", "jpg", "jpeg","webp"],
            fileFilter: (req, file, cb)=>{
                if(!file.originalname.match(/\.(svg | gif | doc | pdf)$/)){
                    return cb(new Error('File type not valid'))
                }
                cb(null, file.originalname)
            },
            public_id: `mm-${file.originalname}`
        }
    }
});
const uploadCloud = multer({storage})

module.exports = uploadCloud;