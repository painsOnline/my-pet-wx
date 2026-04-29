<script setup lang="ts">
import { ref, watch } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import type { OrderItem, OrderListParams } from '@/types/order'
import { OrderState } from '@/enums/order'
import { orderStateList } from '@/constants/order'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 定义 porps
const props = defineProps<{
  orderState: number
}>()

// 请求参数
const queryParams: Required<OrderListParams> = {
  page: 1,
  pageSize: 5,
  orderState: props.orderState,
}

// 获取订单列表
const orderList = ref<OrderItem[]>([])

// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false)

// 是否分页结束
const isFinish = ref(false)

// 是否触发下拉刷新
const isTriggered = ref(false)

// Mock 商品池
const skuPool = [
  { id: 'sku1', productId: 'p1', name: '尼可露混合膨润土猫砂除臭抑菌2.5Kg/袋', attrsText: '2.5Kg/袋', quantity: 1, price: 120, oldPrice: 128, picture: '/static/images/product-s3.png' },
  { id: 'sku2', productId: 'p2', name: '好命天生原味木薯除臭猫砂除臭抑菌1.5Kg/袋', attrsText: '1.5Kg/袋', quantity: 2, price: 80, oldPrice: 90, picture: '/static/images/product-s1.png' },
  { id: 'sku3', productId: 'p3', name: '鲜朗低温烘培猫粮幼猫专用除臭抑菌2.5Kg/袋', attrsText: '2.5Kg/袋', quantity: 3, price: 100, oldPrice: 110, picture: '/static/images/product-s2.png' },
  { id: 'sku4', productId: 'p4', name: '小佩智能猫砂盆卡通漂亮适合犬猫', attrsText: '白色 标准款', quantity: 1, price: 599, oldPrice: 699, picture: '/static/images/product.png' },
  { id: 'sku5', productId: 'p5', name: '网易严选全价猫粮高营养富蛋白', attrsText: '5Kg/袋', quantity: 1, price: 199, oldPrice: 239, picture: '/static/images/product-s1.png' },
  { id: 'sku6', productId: 'p6', name: 'pidan猫咪冻干零食适合小猫和大猫', attrsText: '鸡肉味 50g', quantity: 1, price: 39, oldPrice: 49, picture: '/static/images/product-s3.png' },
  { id: 'sku7', productId: 'p7', name: '里兜混合猫砂超级吸水除臭抑菌6L/袋', attrsText: '6L/袋 豆腐砂', quantity: 3, price: 45, oldPrice: 59, picture: '/static/images/product-s2.png' },
]

// 生成稳定的 Mock 订单数据（仅初始化一次）
const mockOrders: OrderItem[] = Array.from({ length: 13 }, (_, i) => {
  const skuCount = (i % 3) + 1
  const skus = Array.from({ length: skuCount }, (_, j) => skuPool[(i + j) % skuPool.length])
  const totalNum = skus.reduce((sum, s) => sum + s.quantity, 0)
  const totalMoney = skus.reduce((sum, s) => sum + s.price * s.quantity, 0)
  return {
    id: String(10001 + i),
    orderState: OrderState.ToDeliver,
    skus,
    receiverContact: '曹某人',
    receiverMobile: '15921769899',
    receiverAddress: '广东省惠州市惠阳区星河丹堤花园F区2栋3023',
    createTime: `2026-0${(i % 9) + 1}-${String(10 + i).padStart(2, '0')} 12:30:00`,
    totalMoney,
    payMoney: totalMoney,
    actualPayMoney: +(totalMoney * 0.9).toFixed(2),
    totalNum,
  }
})

const getMemberOrderAPI = async (params: OrderListParams) => {
  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 300))

  const { page = 1, pageSize = 5, orderState } = params

  // 根据 orderState 覆盖每条数据的订单状态，并随机打乱顺序
  const orders = mockOrders
    .map((item) => ({ ...item, skus: [...item.skus], orderState }))
    .sort(() => Math.random() - 0.5)

  const counts = orders.length
  const pages = Math.ceil(counts / pageSize)
  const start = (page - 1) * pageSize
  const items = orders.slice(start, start + pageSize)

  return { items, counts, page, pages, pageSize }
}

const putMemberOrderReceiptByIdAPI = async (id: string) => {
  // TODO: 替换为真实 API 调用
  return true
}

const deleteMemberOrderAPI = async (id: string) => {
  // TODO: 替换为真实 API 调用
  return true
}

const getMemberOrderData = async () => {
  // 如果数据出于加载中，退出函数
  if (isLoading.value) return
  // 退出分页判断
  if (isFinish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  // 发送请求前，标记为加载中
  isLoading.value = true
  // 发送请求
  const res = await getMemberOrderAPI(queryParams)
  // 发送请求后，重置标记
  isLoading.value = false
  // 数组追加
  orderList.value.push(...res.items)
  // 分页条件
  if (queryParams.page < res.pages) {
    // 页码累加
    queryParams.page++
  } else {
    // 分页已结束
    isFinish.value = true
  }
}

// 确认收货
const onOrderConfirm = (id: string) => {
  uni.showModal({
    content: '为保障您的权益，请收到货并确认无误后，再确认收货',
    confirmColor: '#27BA9B',
    success: async (res) => {
      if (res.confirm) {
        await putMemberOrderReceiptByIdAPI(id)
        uni.showToast({ icon: 'success', title: '确认收货成功' })
        // 确认成功，更新为已收货
        const order = orderList.value.find((v) => v.id === id)
        if (order) order.orderState = OrderState.Received
      }
    },
  })
}

// 取消订单
const onOrderCannel = (id: string) => {
  uni.showModal({
    content: '你确定要取消该订单？',
    confirmColor: '#27BA9B',
    success: async (res) => {
      if (res.confirm) {
        await deleteMemberOrderAPI(id)
        // 取消成功，界面中修改订单状态
        const order = orderList.value.find((v) => v.id === id)
        if (order) order.orderState = OrderState.Cancelled
      }
    },
  })
}

onReady(() => {
  getMemberOrderData()
})

// 监听 orderState 变化，重置数据并重新请求
watch(
  () => props.orderState,
  () => {
    queryParams.page = 1
    queryParams.orderState = props.orderState
    orderList.value = []
    isFinish.value = false
    getMemberOrderData()
  },
)

// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 重置数据
  queryParams.page = 1
  orderList.value = []
  isFinish.value = false
  // 加载数据
  await getMemberOrderData()
  // 关闭动画
  isTriggered.value = false
}
</script>

<template>
  <scroll-view
    enable-back-to-top
    scroll-y
    class="orders"
    refresher-enabled
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="getMemberOrderData"
  >
    <view class="card" v-for="order in orderList" :key="order.id">
      <!-- 订单信息 -->
      <view class="status">
        <text class="date">创建时间: {{ order.createTime }}</text>
        <!-- 订单状态文字 -->
        <text>{{ orderStateList[order.orderState].text }}</text>
      </view>
      <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
      <navigator
        v-for="item in order.skus"
        :key="item.id"
        class="goods"
        :url="`/pagesOrder/detail/detail?id=${order.id}`"
        open-type="navigate"
        hover-class="none"
      >
        <view class="cover">
          <image class="image" mode="aspectFit" :src="item.picture"></image>
        </view>
        <view class="meta">
          <view class="name ellipsis">{{ item.name }}</view>
          <view class="type">{{ item.attrsText }}</view>
          <view class="price">￥{{ item.price }}元</view>
        </view>
      </navigator>
      <!-- 支付信息 -->
      <view class="payment">
        <text class="quantity">共{{ order.totalNum }}件商品</text>
        <text>实付</text>
        <text class="amount"> <text class="symbol">¥</text>{{ order.actualPayMoney }}</text>
      </view>
      <!-- 订单操作按钮 -->
      <view class="action">
        <!-- 待配送可以取消 -->
        <template v-if="order.orderState === OrderState.ToDeliver">
          <view class="button primary" @tap="onOrderCannel(order.id)">取消订单</view>
        </template>
        <!-- 配送中: 展示确认收货 -->
        <template v-if="order.orderState === OrderState.Delivering">
          <view class="button primary" @tap="onOrderConfirm(order.id)">确认收货</view>
        </template>
        <!-- 已完成可以再次购买 -->
        <template v-if="order.orderState === OrderState.Completed">
          <navigator
            class="button secondary"
            :url="`/pagesOrder/create/create?orderId=${order.id}`"
            hover-class="none"
          >
            再次购买
          </navigator>
        </template>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
</template>

<style lang="scss">
@use '../styles/orderList.scss';
</style>
