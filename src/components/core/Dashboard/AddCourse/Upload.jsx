import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"
import { Player } from "video-react"
import "video-react/dist/video-react.css"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(viewData || editData || "")
  const inputRef = useRef(null)

  // Preview logic
  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => setPreviewSource(reader.result)
  }

  // Register field on mount
  useEffect(() => {
    register(name, { required: true })
  }, [register, name])

  // Update form value when file changes
  useEffect(() => {
    if (selectedFile) {
      setValue(name, selectedFile)
    }
  }, [selectedFile, setValue, name])

  // Dropzone logic
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles?.[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: video ? { "video/mp4": [".mp4"] } : { "image/*": [".jpg", ".jpeg", ".png"] },
    onDrop,
    multiple: false,
    noClick: true, // Prevent automatic opening
    noKeyboard: true, // Prevent Enter key from triggering
  })

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        <input {...getInputProps()} />

        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover cursor-pointer"
                onClick={open}
              />
            ) : (
              <div onClick={open} className="cursor-pointer">
                <Player aspectRatio="16:9" playsInline src={previewSource} />
              </div>
            )}
            {!viewData && (
              <div className="flex gap-4 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewSource("")
                    setSelectedFile(null)
                    setValue(name, null)
                  }}
                  className="text-richblack-400 underline"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={open}
                  className="text-yellow-100 underline"
                >
                  Change File
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6" onClick={open}>
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop a {video ? "video" : "image"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span>
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size: 1024x576</li>
            </ul>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
