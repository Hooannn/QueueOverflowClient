const client = filestack.init(import.meta.env.VITE_FILESTACK_KEY)
const getOptions = (onUploadDone: Function, externalOptions = {}) => ({
    maxFiles: 1,
    videoResolution: '320x240',
    accept: ['image/*'],
    onUploadDone,
    ...externalOptions
})
export default (onUploadDone: Function, externalOptions = {}) =>
    client.picker(getOptions(onUploadDone, externalOptions))
