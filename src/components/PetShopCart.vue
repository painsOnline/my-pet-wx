<template>
	<view class="shopcart" @add="addCart" @dec="decreaseCart" @input="inputCart" @delAll="delAll">
		<!-- @click="toggleList" -->
		<view class="cartBottom" >
			<view class="carIcon" @click="toggleList">
				<view class="iconBox" :class="getAllCount ? 'active' : '' ">
					<text class="allcount" v-if="getAllCount">{{getAllCount}}</text>
					<image src="/static/tabs/cart.png" mode="" class="img"></image>
				</view>
			</view>
			<view class="middle" @click="toggleList">
				<view class="priceBox">
					<text class="price" :class="getAllCount ?　'active': ''">￥{{getAllPrice}}</text>
					<text class="discount" :class="getAllDiscount">共减￥{{getAllPrice}}</text>
				</view>
				<text class="deliveryPrice">满20免配送费</text>
			</view>
			<view class="BtnRight">
			<button class="goToBuy" :type="buyType" :disabled="buyDis"  @click="buyList">去结算</button>
			</view>
		</view>
		<!-- 选择的商品 -->
		<view class="cartList" v-show="isShowList && getList.length">
			<scroll-view scroll-y style="max-height: 500rpx;">
				<view class="title">
					<text>购物车</text>
					<view class="clear" @click="delShopcart">
						清空购物车
					</view>
				</view>
				<view class="productList">
					<view class="productItem" v-for="(item,index) in getList" :key="index">
						<img class="productImg" :src="item.picture"></img>
						<view class="productInfo">
							<view class="productName">{{item.name}}</view>
							<view class="productAttr">{{ item.attrsText }}</view>
							<view class="productImportBox">
								<view class="productPrice">
									<text class="nowPrice">优惠价￥{{item.nowPrice}}</text>
									<text class="oldPrice">￥{{item.price}}</text>
								</view>
								<cartcontrol :product="item"></cartcontrol>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="listMask" v-show="isShowList && getList.length" @click="toggleList"></view>
	</view>
</template>

<script>
	import cartcontrol from '@/components/CartControl.vue'
	// import {mul} from '@/utils/lib'
	export default {
		props: {
			buyType:'default',
			buyDis:true,
			/*products: {
				type: Array,
				default: () => []
			}*/
		},
		data() {
			return {
				isShowList: false,
				products: [
				{
					id: 'aabbbb',
					skuId: 'aabbbb',
					name: '尼可露 原味 混合猫砂 除臭',
					picture: '/static/images/product-s1.png',
					count: 6,
					price: 100,
					nowPrice: 99,
					inventory: 100,
					selected: true,
					attrsText: '规格：2.5kg/袋',
					isEffective: true
				},
				{
					id: 'dddd',
					skuId: 'aabbddddbb',
					name: '好命天生 豆腐膨润土混合猫砂',
					picture: '/static/images/product-s2.png',
					count: 3,
					price: 100,
					nowPrice: 99,
					inventory: 100,
					selected: true,
					attrsText: '规格：1.5kg/袋',
					isEffective: true
				}
				]
			};
		},
		components: {
			cartcontrol
		},
		computed: {
		/**
		 * 获取商品列表数据
		 * @returns 返回商品数组数据
		 */
		getList() {
				return this.products
			},
			/**
			 * 获取购物车中已选中的商品列表
			 * @returns {Array} 已选中商品的数组
			 */
			getSelection() {
				return (this.products || []).filter(item => item.selected === true)
			},
			// 获得购物车所有商品数量
			getAllCount() {
				let result = 0;
				this.getSelection.forEach((item) => {
					result += item.count
				})
				return result
			},



			// 总价
			getAllPrice() {
				let result = 0;
				this.getSelection.forEach((product) => {
						result += this.accMul(product.count, product.nowPrice)
				})
				return result.toFixed(2)
			}
		},
		methods: {
			// 解决浮点数 运算出现多位小数
			accMul(arg1, arg2) {
				let m = 0,
					s1 = '',
					s2 = '';
				if (arg1 && arg1 != null)
					s1 = arg1.toString();
				if (arg2 && arg2 != null)
					s2 = arg2.toString();
				// console.log('m1',s2.replace('.',''))
				try {
					m += s1.split('.')[1].length
				} catch (e) {}
				try {
					m += s2.split('.')[1].length
				} catch (e) {}

				return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
			},
		

			toggleList() {
				if (this.getList.length) {
					this.isShowList = !this.isShowList;
				}
			},
			buyList() {
				if (this.getSelection.length) {
					console.log("getAllPrice："+this.getAllPrice)
					console.log('buyList：'+JSON.stringify(this.getSelection))
					uni.showToast({
						title:"总价格："+this.getAllPrice
					})
					
				}else{
					
				}
			},
			delShopcart() {
				this.$emit('delAll');
			},
			addCart: function(item) {
				this.$emit('add', item)
			},
			decreaseCart(item) {
				this.$emit('dec', item)
			},
			inputCart(item) {
				if (item.count >= item.inventory) {
					uni.showToast({
						title: "该宝贝不能购买更多了~"
					})
					return false;
				} else {
					this.$emit('input', item)
				}
			
			}

		},
	}
</script>

<style scoped>
	.productItem {
		display: flex;
		flex-direction: row;
		border-bottom: #C8C8C8 1rpx solid;
		padding: 20rpx 0;
	}

	.productItem .productImg {
		height: 90rpx;
		width: 90rpx;
		margin: 10rpx 20rpx 0rpx 10rpx;
	}

	.productItem .productInfo {
		padding: 0 10rpx 0 0;
	}

	.productInfo .productName{
		font-size: 36rpx;
		color: #000;
		/* 字体加粗 */
		font-weight: 500;
		margin-bottom: 10rpx;	
	}

	.productInfo .productAttr {
		font-size: 24rpx;
		color: #C8C8C8;
		margin-bottom: 15rpx;
	}

	.productInfo .productImportBox {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 620rpx;
	}

	.productPrice {
		width: 270rpx;
	}

	.productPrice .nowPrice {
		font-size: 28rpx;
		color: #FE3D2D;
	}

	.productPrice .oldPrice {
		font-size: 24rpx;
		color: #6a7076;
		/* 中间划线 */
		text-decoration: line-through;
		margin-left: 20rpx;
	}
	.shopcart .cartBottom {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 130rpx;
		z-index: 99;
		display: flex;
		background-color: #fff;
	}

	.priceBox{
		padding-top: 10rpx;
		color: #FE3D2D; 
	}

	.price{ 
		font-size: 36rpx; 
	}

	.deliveryPrice{
		color: #C8C8C8;
		font-size: 24rpx;
		padding-left:10rpx;
	}

	.discount {
		font-size: 24rpx;
		/* 中间划线 */
		text-decoration: line-through;
		margin-left:12rpx;
	}

	.carIcon {
		flex: 1;
	}

	.iconBox {
		position: absolute;
		bottom: 22rpx;
		left: 18rpx;
		z-index: 101;
		background-color: #FFE810;
		border-radius: 50%;
		height: 130rpx;
		width: 130rpx;
		line-height: 55rpx;
	}

	.iconBox .allcount {
		position: absolute;
		right: -6rpx;
		top: 0;
		display: inline-block;
		padding: 0 2rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		font-weight: 400;
		border-radius: 10rpx;
		background-color: #f01414;
		color: #ffffff;
	}

	.img {
		font-size: 50rpx;
		line-height: 50rpx;
		width: 90rpx;
		height: 90rpx;
		padding-left:20rpx;
		padding-top: 20rpx;
		color: #cccccc;
		border-radius: 50%;
	}

	.carIcon .active {
		background-color: #FEE53F;
	}

	.middle {
		display: flex;
		flex-direction: column;
		flex: 2;
		color: #ffffff;
	}

	.BtnRight {
		flex: 1;
		border-radius: 20rpx;
		margin: 10rpx;
		z-index:99999;
	}

	.cartList {
		position: fixed;
		bottom: 130rpx;
		left: 0;
		right: 0;
		z-index: 90;
		border-radius: 30rpx;
	}

	.cartList .title,
	.cartList .list-text {
		display: flex;
		flex-direction: row;
	}

	.cartList .title {
		background: #F3F5F7;
		justify-content: space-between;
		padding: 4rpx 8rpx;
	}

	.cartList .list-text {
		padding: 10rpx 6rpx 10rpx 8rpx;
		text-align: center;
	}

	.productList {
		background: #F8F8F8;
		padding-bottom: 10rpx;
	}

	.goToBuy{
		background-color: #FEE53F;
		border-radius: 30rpx;
	}


	/* 遮布 */
	.listMask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 89;
		opacity: 0.5;
		background: #6a7076;
	}

	.clear {
		color:#C8C8C8;
		font-size:24rpx;
	}
</style>
