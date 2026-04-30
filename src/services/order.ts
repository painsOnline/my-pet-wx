import type { DataResult, PageResult } from  '../types/global'
import type { OrderDetail, OrderItem, OrderListParams } from '../types/order'
import { OrderState } from '../enums/order'
import { mockDataResult} from "../utils/http"

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

// 生成订单详情 Mock 数据
const createOrderDetailMock = (id: string, orderState: OrderState): DataResult<OrderDetail> => {
  return {
    code: '000000',
    msg: 'success',
    result: {
      id,
      orderState,
      skus: [
        {
          id: 'sku2',
          productId: 'p2',
          name: '好命天生原味木薯除臭猫砂去除异味1.5Kg/袋',
          attrsText: '1.5Kg/袋',
          quantity: 2,
          price: 80,
          oldPrice: 90,
          picture: '/static/images/product-s1.png',
        },
        {
          id: 'sku3',
          productId: 'p2',
          name: '尼可露豆腐混合土除臭抑菌进口猫砂1.5Kg/袋',
          attrsText: '1.5Kg/袋',
          quantity: 1,
          price: 80,
          oldPrice: 90,
          picture: '/static/images/product-s1.png',
        },
      ],
      receiverContact: '曹某人',
      receiverMobile: '15921769899',
      receiverAddress: '广东省惠州市惠阳区星河丹堤花园F区2栋3023',
      createTime: '2026-04-28 12:30:00',
      totalMoney: 280,
      payMoney: 280,
      actualPayMoney: 252,
    },
  }
}

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

/**
 * 确认收货
 * @description 仅在订单状态为待收货时，可确认收货。
 * @param id 订单id
 */
export const putMemberOrderReceiptByIdAPI = async (id: string) => {
  // 确认收货后状态变为已收货
  return createOrderDetailMock(id, OrderState.Received)
}

/**
 * 取消订单
 * @description 仅在订单状态为待付款时，可取消订单。
 * @param id 订单id
 * @param data cancelReason 取消理由
 */
export const getMemberOrderCancelByIdAPI = async (id: string, data: { cancelReason: string }) => {
  // 取消订单后状态变为已取消
  return createOrderDetailMock(id, OrderState.Cancelled)
}

/**
 * 获取订单详情
 * @param id 订单id
 */
export const getMemberOrderByIdAPI = async (id: string) => {
  // 随机返回一种订单状态
  const states = [OrderState.ToDeliver, OrderState.Delivering, OrderState.Received, OrderState.Completed, OrderState.Cancelled]
  const randomState = states[Math.floor(Math.random() * states.length)]
  return createOrderDetailMock(id, randomState)
}


export const getMemberOrderAPI = async (params: OrderListParams) => {
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

  return mockDataResult<PageResult<OrderItem>>("200", "", {
    items: items,
    counts: counts,
    page: start,
    pages: pages,
    pageSize: pageSize,
  })
}


export const deleteMemberOrderAPI = async (id: string) => {
  // TODO: 替换为真实 API 调用
  return mockDataResult<boolean>("200", "", true)
}
