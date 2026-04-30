<script setup lang="ts">
defineProps<{
  product: Record<string, any>
}>()

const emit = defineEmits<{
  add: [item: Record<string, any>]
  dec: [item: Record<string, any>]
  input: [item: Record<string, any>]
}>()

const addCart = (item: Record<string, any>) => {
  emit('add', item)
}

const decreaseCart = (item: Record<string, any>) => {
  emit('dec', item)
}

const inputCart = (item: Record<string, any>) => {
  if (item.count >= item.inventory) {
    uni.showToast({ title: '该宝贝不能购买更多了~' })
  } else {
    emit('input', item)
  }
}
</script>

<template>
  <view class="opCart">
    <view class="product-control">
      <view class="cont" v-if="product.count > 0" @click="decreaseCart(product)">
        <image src="/static/tabs/des-now.png" />
      </view>
      <input
        v-if="product.count > 0"
        class="buyNum"
        type="number"
        v-model="product.count"
        @input="inputCart(product)"
      />
      <view class="cont" @click="addCart(product)">
        <image src="/static/tabs/add-now.png" />
      </view>
    </view>
  </view>
</template>

<style scoped>
.opCart {
  display: flex;
  flex-direction: row;
  height: 36rpx;
  float: right;
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
  border: 1rpx solid #c8c7cc;
  border-radius: 6rpx;
  text-align: center;
  vertical-align: middle;
}
</style>
