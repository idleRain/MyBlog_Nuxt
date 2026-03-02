import { successResponse, errorResponse } from '~/server/utils/response'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    const authHeader = getHeader(event, 'Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('未授权访问', 401)
    }

    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      return errorResponse('没有上传文件')
    }

    const file = formData[0]
    if (!file.filename || !file.data) {
      return errorResponse('文件数据无效')
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type || '')) {
      return errorResponse('不支持的文件类型')
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.data.length > maxSize) {
      return errorResponse('文件大小超过限制')
    }

    // Generate unique filename
    const ext = path.extname(file.filename)
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const newFilename = `${timestamp}-${randomStr}${ext}`

    // Create upload directory
    const config = useRuntimeConfig()
    const uploadDir = path.join(process.cwd(), config.uploadDir as string || 'uploads')
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const filePath = path.join(uploadDir, newFilename)
    await writeFile(filePath, file.data)

    // Generate URL
    const publicUrl = `/uploads/${newFilename}`

    return successResponse({
      name: newFilename,
      originalName: file.filename,
      mimeType: file.type,
      size: file.data.length,
      url: publicUrl,
      path: filePath,
    }, '上传成功')
  } catch (error) {
    console.error('Upload error:', error)
    return errorResponse('上传失败')
  }
})
