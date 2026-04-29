<template>
  <!-- 分类及商品列表 -->
  <view class="viewport">
    <!-- 自定义导航栏 -->
    <pet-nav-bar />
    <!-- 分类 -->
    <view class="categories">
      <!-- 左侧：一级分类 -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="item in categoryList"
          :key="item.id"
          class="item"
          :class="{ active: item.id === activeCategory }"
          @tap="activeCategory = item.id"
        >
          <text class="name">
            {{ item.name }}
          </text>
        </view>
      </scroll-view>
      <!-- 右侧：分类商品 -->
      <scroll-view enable-back-to-top class="productList" scroll-y>
        <!-- 内容区域 -->
        <view class="panel" v-for="[categoryId, products] in categoryProductListMap" :key="categoryId">
					<view class="productItem" v-for="product in products" :key="product.id">
						<image class="productImg" :src="product.picture"></image>
						<view class="productInfo">
							<view class="productName">{{product.name}}</view>
							<view class="productAttr">{{ product.desc }}</view>
							<view class="productImportBox">
								<view class="productPrice">
									<text class="nowPrice">优惠价￥{{product.price}}</text>
								</view>
                <view>
                  <text class="oldPrice">￥{{product.oldPrice}}</text>
                  <cartcontrol :product="{...product.skus[0], count: 0}"></cartcontrol>
                </view>
							</view>
						</view>
					</view>
				</view>

        <!-- <view class="panel" v-for="[categoryId, products] in categoryProductListMap" :key="categoryId">
          <view class="section">
            <navigator
              v-for="product in products"
              :key="product.id"
              class="goods"
              hover-class="none"
              :url="`/pages/goods/goods?id=${product.id}`"
            >
              <image class="image" :src="product.picture"></image>
              <view class="name ellipsis">{{ product.name }}</view>
              <view class="price">
                <text class="symbol">¥</text>
                <text class="number">{{ product.price }}</text>
              </view>
            </navigator>
          </view>
        </view> -->
      </scroll-view>
    </view>
  <PetShopCart/>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShow, onHide, onReady, onUnload } from '@dcloudio/uni-app'
import type { CategoryItem } from '@/types/category'
import type {ProductDetail} from '@/types/product'
import PetNavBar from '@/components/PetNavBar.vue';
import cartcontrol from '@/components/CartControl.vue'


// 获取分类列表数据
const categoryList = ref<CategoryItem[]>([
  {
    id: '1',
    name: '品质猫砂',
    picture: ""
  },
  {
    id: '2',
    name: '品牌猫粮',
    picture: ""
  },
  {
    id: '3',
    name: '品牌狗粮',
    picture: ""
  },
  {
    id: '4',
    name: '猫咪零食',
    picture: ""
  },
  {
    id: '5',
    name: '狗狗零食',
    picture: ""
  },
  {
    id: '6',
    name: '猫咪玩具',
    picture: ""
  },
  {
    id: '7',
    name: '狗狗玩具',
    picture: ""
  }
])

const productImages = ['/static/images/product-s1.png', '/static/images/product-s2.png', '/static/images/product-s3.png']
const randomImage = () => productImages[Math.floor(Math.random() * productImages.length)]

//获取分类商品列表数据
const categoryProductListMap = ref<Map<string, ProductDetail[]>>(new Map())
categoryList.value.forEach(category => categoryProductListMap.value.set(category.id, [
  {
    id: "aaa",
    name: "尼可露豆腐猫砂6L/袋原味膨润土除臭猫砂",
    desc: "商品简单描述",
    price: 24.8,
    oldPrice: 28,
    details: "这是一个商品",
    picture: randomImage(),
    mainPictures: [],
    skus:[
      {
        id: "sku1",
        inventory: 100,
        oldPrice: 28,
        price: 24.8,
        picture: randomImage(),
        skuCode: "s001",
        specs: []
      }
    ],
    specs: []
  },
  {
    id: "aaa",
    name: "好命天生木薯混合猫砂除臭强2.5Kg/袋",
    desc: "商品简单描述",
    price: 17.8,
    oldPrice: 20,
    details: "这是一个商品",
    picture: randomImage(),
    mainPictures: [],
    skus:[
      {
        id: "sku1",
        inventory: 200,
        oldPrice: 20,
        price: 17.8,
        picture: randomImage(),
        skuCode: "s001",
        specs: []
      }
    ],
    specs: []
  },
  {
    id: "aaa",
    name: "好命天生木薯混合猫砂除臭强2.5Kg/袋",
    desc: "商品简单描述",
    price: 17.8,
    oldPrice: 20,
    details: "这是一个商品",
    picture: randomImage(),
    mainPictures: [],
    skus:[
      {
        id: "sku1",
        inventory: 200,
        oldPrice: 20,
        price: 17.8,
        picture: randomImage(),
        skuCode: "s001",
        specs: []
      }
    ],
    specs: []
  }
]))

// 当前分类页面
const activeCategory = ref("")
if(categoryList.value.length > 0) {
  activeCategory.value = categoryList.value[0].id
}

onLoad(() => {})
onReady(() => {})
onShow(() => {})
onHide(() => {})
onUnload(() => {})
</script>

<style lang="scss">
@use './styles/category.scss';
</style>
