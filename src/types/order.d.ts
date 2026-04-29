import { OrderState } from "./../enums/order"
import { PageParams, PageResult } from "./global"

/** 订单列表 */
export type OrderList = {
  /** 数据集合    [ 订单信息 ] */
  items: OrderItem[]
}


/** 订单详情 返回信息 */
export type OrderDetail = {
  /** 订单编号 */
  id: string
  /** 订单状态，1待配送、2配送中、3已收货、4已完成、5已取消 */
  orderState: OrderState
  /** 商品集合 [ 商品信息 ] */
  skus: OrderSkuItem[]
  /** 收货人 */
  receiverContact: string
  /** 收货人手机 */
  receiverMobile: string
  /** 收货人地址 */
  receiverAddress: string
  /** 下单时间 */
  createTime: string
  /** 商品总价 */
  totalMoney: number
  /** 应付金额 */
  payMoney: number
  /** 实付金额 */
  actualPayMoney: number
}

/** 商品信息 */
export type OrderSkuItem = {
  /** sku id */
  id: string
  /** 商品 id */
  productId: string
  /** 商品名称 */
  name: string
  /** 商品属性文字 */
  attrsText: string
  /** 数量 */
  quantity: number
  /** 购买时单价 */
  price: number
  /** 原价 */
  oldPrice: number
  /** 图片地址 */
  picture: string
}


/** 订单列表参数 */
export type OrderListParams = PageParams & { orderState: number }

/** 订单列表 */
export type OrderListResult = PageResult<OrderItem>

/** 订单列表项 */
export type OrderItem = OrderDetail & {
  /** 总件数 */
  totalNum: number
}
