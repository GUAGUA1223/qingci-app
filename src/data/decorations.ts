// 小狐狸窝装饰系统 - 按坚持天数解锁，使用图片资源
import { decoImages } from '../../assets/images';

export interface Decoration {
  id: string;
  name: string;
  icon: any;
  price: number;
  category: 'furniture' | 'plant' | 'light' | 'special';
  description: string;
}

export const DECORATIONS: Decoration[] = [
  { id: 'bed_basic', name: '小木床', icon: decoImages.bed, price: 0, category: 'furniture', description: '基础款舒适小床' },
  { id: 'plant_green', name: '绿植', icon: decoImages.plant, price: 0, category: 'plant', description: '清新可爱的绿植盆栽' },
  { id: 'lamp_warm', name: '暖灯', icon: decoImages.lamp, price: 3, category: 'light', description: '温暖的灯光陪伴' },
  { id: 'bookshelf', name: '书架', icon: decoImages.bookshelf, price: 7, category: 'furniture', description: '装满知识的小书架' },
  { id: 'star_lamp', name: '星星灯', icon: decoImages.star_lamp, price: 14, category: 'light', description: '闪烁的星星灯' },
  { id: 'rainbow', name: '彩虹', icon: decoImages.rainbow, price: 21, category: 'special', description: '美丽的彩虹装饰' },
  { id: 'moon_light', name: '月光瓶', icon: decoImages.moon, price: 30, category: 'light', description: '散发柔和月光的瓶子' },
  { id: 'garden', name: '小花园', icon: decoImages.garden, price: 50, category: 'plant', description: '五彩缤纷的小花园' },
  { id: 'cloud_bed', name: '云朵床', icon: decoImages.cloud_bed, price: 66, category: 'furniture', description: '躺在云朵上的感觉' },
  { id: 'aurora', name: '极光', icon: decoImages.crown, price: 100, category: 'special', description: '梦幻般的极光' },
];

export const getDecorationById = (id: string): Decoration | undefined => DECORATIONS.find(d => d.id === id);
export const getUnlockedDecorations = (days: number): Decoration[] => DECORATIONS.filter(d => d.price <= days);
export const getLockedDecorations = (days: number): Decoration[] => DECORATIONS.filter(d => d.price > days);
export const getDecorationsByCategory = (cat: Decoration['category']): Decoration[] => DECORATIONS.filter(d => d.category === cat);
