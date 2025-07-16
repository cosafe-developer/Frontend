const FileUpload = ({ previewUrl, fileInputRef, handleChange }) => (
  <div>
    <label className="block text-sm mb-2 text-[#B7BAC4]">Logotipo</label>
    <label
      htmlFor="logotipo"
      className="w-32 h-32 cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
    >
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
      ) : (
        <img
          src="/images/Upload.png"
          alt="Upload icon"
          className="w-10 h-10 object-contain opacity-70"
        />
      )}
    </label>
    <input
      type="file"
      id="logotipo"
      name="logotipo"
      ref={fileInputRef}
      onChange={handleChange}
      className="hidden"
    />
  </div>
);

export default FileUpload;
