import { NextRequest, NextResponse } from 'next/server'




export async function POST(request: NextRequest) {
    
    // const baseUrl = process.env.BASE_URL || "http://localhost:23450"
    const baseUrl = process.env.BASE_URL || "http://124.223.72.61:23450"
    
    console.log('🚀 API代理被调用')
    console.log('📍 后端地址:', baseUrl)

    try {
        // 获取前端发送的数据
        const body = await request.json()
        console.log('📤 发送到后端的数据:', body)

        const targetUrl = `${baseUrl}/api/auth`
        console.log('🎯 请求目标URL:', targetUrl)

        // 代理到你的后端服务器
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        console.log('📥 后端响应状态:', response.status)
        console.log('📥 后端响应头:', Object.fromEntries(response.headers.entries()))

        // 检查响应是否成功
        if (!response.ok) {
            const errorText = await response.text()
            console.error('❌ 后端错误响应:', errorText)
            return NextResponse.json(
                { error: `Backend error: ${response.status}`, details: errorText },
                { status: response.status }
            )
        }

        // 获取后端返回的数据
        const responseText = await response.text()
        console.log('📥 后端原始响应:', responseText)
        
        let data
        try {
            data = JSON.parse(responseText)
        } catch (parseError) {
            console.error('❌ JSON解析错误:', parseError)
            return NextResponse.json(
                { error: 'Invalid JSON response from backend', response: responseText },
                { status: 502 }
            )
        }

        console.log('✅ 成功解析的数据:', data)
        return NextResponse.json(data)

    } catch (error) {
        console.error('❌ 代理错误详情:', error)
        console.error('❌ 错误堆栈:', error instanceof Error ? error.stack : 'No stack trace')
        return NextResponse.json(
            { 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : 'Unknown error',
                baseUrl: baseUrl
            },
            { status: 500 }
        )
    }
}

// 处理 OPTIONS 预检请求（CORS）
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
}