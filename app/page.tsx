"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface AuthFormData {
  account: string
  password: string
  currentDistance: string | number
  targetDistance: string | number
}

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"
const baseUrl = "/api/proxy"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<AuthFormData>({
    mode: "onChange",
    defaultValues: {
      account: "",
      password: "",
      currentDistance: "",
      targetDistance: "",
    },
  })

  // 根据返回状态码显示对应的toast消息
  const showResultToast = (code: number) => {
    switch (code) {
      case 1:
        toast.success("登记成功", {
          description: "账号不存在，已成功创建新用户。",
        })
        break
      case 2:
        toast.success("已登记", {
          description: "账号存在，密码正确，距离数据未变，已执行跑步。",
        })
        break
      case 3:
        toast.error("账号或密码错误", {
          description: "Login失败或本地密码不匹配。",
        })
        break
      case 5:
        toast.error("系统错误", {
          description: "数据库错误或其他系统错误。",
        })
        break
      case 6:
        toast.success("距离更新成功", {
          description: "账号存在，密码正确，距离数据已更新。",
        })
        break
      default:
        toast.error("未知错误", {
          description: `未知状态码: ${code}`,
        })
    }
  }

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true)
    
    try {
      // 构造请求数据，匹配API接口结构
      const requestData = {
        account: data.account,
        password: data.password,
        current_distance: Number(data.currentDistance) || 0,
        target_distance: Number(data.targetDistance) || 80,
      }

      console.log("提交数据:", requestData)
      
      // TODO: 替换为实际的API端点
      const response = await fetch(`${baseUrl}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()
      console.log("请求成功:", result)
      
      // 根据返回的状态码显示对应的toast消息
      if (result.code !== undefined) {
        showResultToast(result.code)
      } else {
        toast.error("响应格式错误", {
          description: "请求成功，但返回格式异常",
        })
      }
      
    } catch (error) {
      console.error("提交失败:", error)
      toast.error("提交失败", {
        description: error instanceof Error ? error.message : '未知错误',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* 标题区域 */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            runrun
          </h1>
          <p className="text-gray-600 text-lg">实现校园跑自由</p>
        </div>

        {/* 表单区域 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="account"
                rules={{ 
                  required: "请输入账号",
                  minLength: { value: 1, message: "账号不能为空" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>账号 <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="请输入账号" 
                        {...field} 
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{ 
                  required: "请输入密码",
                  minLength: { value: 1, message: "密码不能为空" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码 <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="请输入密码" 
                        {...field} 
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentDistance"
                rules={{ 
                  required: "请输入已跑步距离",
                  validate: (value) => {
                    const num = Number(value);
                    if (isNaN(num)) return "请输入有效的数字";
                    if (num < 0) return "距离不能为负数";
                    return true;
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>已跑步距离 (km) <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.1"
                        placeholder="请输入已跑步距离" 
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetDistance"
                rules={{
                  validate: (value) => {
                    if (!value) return true; // 可选字段
                    const num = Number(value);
                    if (isNaN(num)) return "请输入有效的数字";
                    if (num < 0) return "距离不能为负数";
                    return true;
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>目标总距离 (km)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.1"
                        placeholder="默认80km" 
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "提交中..." : "开始跑步"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
