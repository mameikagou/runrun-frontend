import { NextRequest, NextResponse } from 'next/server'




export async function POST(request: NextRequest) {

    const baseUrl = process.env.BASE_URL || "http://localhost:23450"
    try {
        // 获取前端发送的数据
        const body = await request.json()

        // 代理到你的后端服务器
        const response = await fetch(`${baseUrl}/api/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        // 检查响应是否成功
        if (!response.ok) {
            return NextResponse.json(
                { error: `Backend error: ${response.status}` },
                { status: response.status }
            )
        }

        // 获取后端返回的数据
        const data = await response.json()

        // 返回给前端
        return NextResponse.json(data)

    } catch (error) {
        console.error('Proxy error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
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