import type { DataResult } from  '../types/global'
import type { OrderDetail } from '../types/order'
import { OrderState } from '../enums/order'

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
