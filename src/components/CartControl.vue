<template>
	<view class="opCart" @add="addCart" @dec="decreaseCart" @input="inputCart">
		<view class="product-control">
			<view class="cont" v-if="product.count>0" @click="decreaseCart(product)">
				<image src="/static/tabs/des-now.png" mode=""></image>
			</view>
			<!-- <text style="padding: 0 4px;" v-show="food.count>0">{{food.count}}</text> -->
			<input v-if="product.count > 0" class="buyNum" type="number" maxlength="3" v-model="product.count"  @input="inputCart(product)"/>
			<view  class="cont" @click="addCart(product)">
				<image src="/static/tabs/add-now.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			product: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
			};
		},
		methods: {
			addCart: function(item) {
				this.$emit('add',item)
			},
			decreaseCart(item) {
				this.$emit('dec',item)
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
		}
	}
</script>

<style scoped>
	.opCart {
		display: flex;
		flex-direction: row;
		height: 36rpx;
		float:right;
	}

	.product-control {
		display: flex;
		flex: 1;
		justify-content: space-around;
	}

	.product-control img {
		width: 36rpx;
		height: 36rpx;
	}

	.cont {
		width: 36rpx;
		height: 36rpx;
		text-align: center;
	}

	.buyNum {
		margin: 0 10rpx;
		width: 60rpx;
		padding: 0 1rpx;
		border: 1rpx solid #C8C7CC;
		border-radius: 6rpx;
		text-align: center;
		vertical-align: middle;
	}
</style>
