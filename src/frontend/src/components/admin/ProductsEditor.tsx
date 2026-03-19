import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useGetProducts, useAddProduct, useUpdateProduct, useDeleteProduct, useGetCategories } from '../../hooks/useQueries';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, Category, PairingFood, TastingNote, FlavorProfile, ProductInfo } from '@/backend';
import { PairingFoodSelection } from './product-sub-editors/PairingFoodSelection';
import { TastingNoteSelection } from './product-sub-editors/TastingNoteSelection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const productInfoSuggestions = [
  'vintage', 'grapeVariety', 'region', 'capacity', 'alcoholContent', 'servingTemp', 'Other'
];

const MAX_PRODUCT_INFOS = 6;

const flavorProfileSuggestions = [
  'sweetness', 'tannins', 'body', 'acidity', 'alcohol', 'Other'
];

const MAX_FLAVOR_PROFILES = 5;

// Static mock data for pairings and tasting notes, derived from OrderPage.tsx


export default function ProductsEditor() {
  const { data: productsData, isLoading } = useGetProducts();
  const { data: categories } = useGetCategories();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    imageUrl: '',
    price: 0n,
    categories: [],
    id: 0n, // Backend will likely assign this
    paring: [],
    tasting: [],
    profile: [], // Initialize with empty array
    info: [], // Initialize with empty array
    isHighlighted: false, // Initialize with false
    classificationTag: { name: '', value: '' }, // Initialize with default values
  });

  // Extract products from [bigint, Product][] format
  const products = productsData?.map(([_, product]) => product) || [];


  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      price: 0n,
      categories: [],
      id: 0n,
      paring: [],
      tasting: [],
      profile: [], // Initialize with empty array
      info: [], // Initialize with empty array
      isHighlighted: false, // Initialize with false
      classificationTag: { name: '', value: '' }, // Initialize with default values
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      price: 0n,
      categories: [],
      id: 0n,
      paring: [],
      tasting: [],
    });
  };

  const handleCategoryToggle = (category: Category) => {
    setFormData(prev => {
      const isSelected = prev.categories.some(c => c.id === category.id);
      return {
        ...prev,
        categories: isSelected
          ? prev.categories.filter(c => c.id !== category.id)
          : [...prev.categories, category]
      };
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Vui lòng nhập mô tả sản phẩm');
      return;
    }

    try {
      if (isAdding) {
        await addProduct.mutateAsync(formData);
        toast.success('Đã thêm sản phẩm thành công');
      } else if (editingProduct) {
        await updateProduct.mutateAsync(formData);
        toast.success('Đã cập nhật sản phẩm thành công');
      }
      handleCancel();
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('Unauthorized')) {
        toast.error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
      } else {
        toast.error('Có lỗi xảy ra: ' + errorMessage);
      }
      console.error('Product save error:', error);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Đã xóa sản phẩm thành công');
      setDeleteConfirm(null);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('Unauthorized')) {
        toast.error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
      } else {
        toast.error('Có lỗi xảy ra: ' + errorMessage);
      }
      console.error('Product delete error:', error);
    }
  };

  const getImagePreviewUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/')) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `/assets/${url}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-foreground/60">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quản lý Sản phẩm</CardTitle>
              <CardDescription>
                Thêm, sửa, xóa các sản phẩm rượu vang. Sản phẩm sẽ hiển thị ngay trên trang chủ sau khi lưu.
              </CardDescription>
            </div>
            <Button onClick={handleAdd} disabled={isAdding || editingProduct !== null}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(isAdding || editingProduct) && (
            <Card className="mb-6 border-primary">
              <CardHeader>
                <CardTitle className="text-lg">
                  {isAdding ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên sản phẩm *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ví dụ: Rượu Vang Hảo Hạng"
                      disabled={!isAdding}
                    />
                    {!isAdding && (
                      <p className="text-xs text-foreground/60">
                        Tên sản phẩm không thể thay đổi sau khi tạo
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá (VNĐ) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price.toString()}
                      onChange={(e) => setFormData({ ...formData, price: BigInt(e.target.value || 0) })}
                      placeholder="450000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về sản phẩm..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL hình ảnh</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="wine-bottles-premium.dim_800x600.jpg"
                  />
                  <p className="text-xs text-foreground/60">
                    Nhập tên file từ assets (ví dụ: wine-bottles-premium.dim_800x600.jpg) hoặc URL đầy đủ
                  </p>
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={getImagePreviewUrl(formData.imageUrl)}
                        alt="Preview"
                        className="h-32 w-auto rounded border object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Highlight Product Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isHighlighted"
                    checked={formData.isHighlighted}
                    onCheckedChange={(checked) => setFormData({ ...formData, isHighlighted: checked as boolean })}
                  />
                  <Label htmlFor="isHighlighted">Hiển thị trên trang chủ (Sản phẩm nổi bật)</Label>
                </div>

                {/* Product Info (Dynamic Fields) */}
                <div className="space-y-2">
                  <Label>Thông tin sản phẩm / Product Information</Label>
                  <div className="space-y-3 border rounded-md p-4">
                    {formData.info.length === 0 && (
                      <p className="text-sm text-foreground/60">Chưa có thông tin sản phẩm nào.</p>
                    )}
                    {formData.info.map((infoItem, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            value={infoItem.name}
                            onValueChange={(value) => {
                              const newInfo = [...formData.info];
                              newInfo[index] = { ...newInfo[index], name: value === 'Other' ? '' : value };
                              setFormData({ ...formData, info: newInfo });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn thông tin" />
                            </SelectTrigger>
                            <SelectContent>
                              {productInfoSuggestions.map(suggestion => (
                                <SelectItem key={suggestion} value={suggestion}>
                                  {suggestion}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {infoItem.name === '' && (
                            <Input
                              placeholder="Tên thông tin tùy chỉnh"
                              value={infoItem.name}
                              onChange={(e) => {
                                const newInfo = [...formData.info];
                                newInfo[index] = { ...newInfo[index], name: e.target.value };
                                setFormData({ ...formData, info: newInfo });
                              }}
                              className="mt-2"
                            />
                          )}
                        </div>
                        <Input
                          placeholder="Giá trị (ví dụ: 2021)"
                          value={infoItem.value}
                          onChange={(e) => {
                            const newInfo = [...formData.info];
                            newInfo[index] = { ...newInfo[index], value: e.target.value };
                            setFormData({ ...formData, info: newInfo });
                          }}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newInfo = formData.info.filter((_, i) => i !== index);
                            setFormData({ ...formData, info: newInfo });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Info (Dynamic Fields) */}
                <div className="space-y-2">
                  <Label>Thông tin sản phẩm / Product Information</Label>
                  <div className="space-y-3 border rounded-md p-4">
                    {formData.info.length === 0 && (
                      <p className="text-sm text-foreground/60">Chưa có thông tin sản phẩm nào.</p>
                    )}
                    {formData.info.map((infoItem, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            value={infoItem.name}
                            onValueChange={(value) => {
                              const newInfo = [...formData.info];
                              if (value !== 'Other' && newInfo.some((item, i) => i !== index && item.name === value)) {
                                toast.error('Tên thông tin sản phẩm đã tồn tại. Vui lòng chọn tên khác.');
                                return;
                              }
                              newInfo[index] = { ...newInfo[index], name: value === 'Other' ? '' : value };
                              setFormData({ ...formData, info: newInfo });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn thông tin" />
                            </SelectTrigger>
                            <SelectContent>
                              {productInfoSuggestions.map(suggestion => (
                                <SelectItem key={suggestion} value={suggestion}>
                                  {suggestion}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {infoItem.name === '' && (
                            <Input
                              placeholder="Tên thông tin tùy chỉnh"
                              value={infoItem.name}
                              onChange={(e) => {
                                const newInfo = [...formData.info];
                                if (e.target.value.trim() !== '' && newInfo.some((item, i) => i !== index && item.name === e.target.value)) {
                                  toast.error('Tên thông tin sản phẩm đã tồn tại. Vui lòng chọn tên khác.');
                                  return;
                                }
                                newInfo[index] = { ...newInfo[index], name: e.target.value };
                                setFormData({ ...formData, info: newInfo });
                              }}
                              className="mt-2"
                            />
                          )}
                        </div>
                        <Input
                          placeholder="Giá trị (ví dụ: 2021)"
                          value={infoItem.value}
                          onChange={(e) => {
                            const newInfo = [...formData.info];
                            newInfo[index] = { ...newInfo[index], value: e.target.value };
                            setFormData({ ...formData, info: newInfo });
                          }}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newInfo = formData.info.filter((_, i) => i !== index);
                            setFormData({ ...formData, info: newInfo });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (formData.info.length >= MAX_PRODUCT_INFOS) {
                          toast.error(`Chỉ được phép tối đa ${MAX_PRODUCT_INFOS} thông tin sản phẩm.`);
                          return;
                        }
                        setFormData({ ...formData, info: [...formData.info, { name: '', value: '' }] });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm dòng thông tin
                    </Button>
                  </div>
                </div>

                {/* Flavor Profile (Dynamic Fields) */}
                <div className="space-y-2">
                  <Label>Hương vị / Flavor Profile</Label>
                  <div className="space-y-3 border rounded-md p-4">
                    {formData.profile.length === 0 && (
                      <p className="text-sm text-foreground/60">Chưa có thông tin hương vị nào.</p>
                    )}
                    {formData.profile.map((profileItem, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            value={profileItem.name}
                            onValueChange={(value) => {
                              const newProfile = [...formData.profile];
                              if (value !== 'Other' && newProfile.some((item, i) => i !== index && item.name === value)) {
                                toast.error('Tên hương vị đã tồn tại. Vui lòng chọn tên khác.');
                                return;
                              }
                              newProfile[index] = { ...newProfile[index], name: value === 'Other' ? '' : value };
                              setFormData({ ...formData, profile: newProfile });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn hương vị" />
                            </SelectTrigger>
                            <SelectContent>
                              {flavorProfileSuggestions.map(suggestion => (
                                <SelectItem key={suggestion} value={suggestion}>
                                  {suggestion}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {profileItem.name === '' && (
                            <Input
                              placeholder="Tên hương vị tùy chỉnh"
                              value={profileItem.name}
                              onChange={(e) => {
                                const newProfile = [...formData.profile];
                                if (e.target.value.trim() !== '' && newProfile.some((item, i) => i !== index && item.name === e.target.value)) {
                                  toast.error('Tên hương vị đã tồn tại. Vui lòng chọn tên khác.');
                                  return;
                                }
                                newProfile[index] = { ...newProfile[index], name: e.target.value };
                                setFormData({ ...formData, profile: newProfile });
                              }}
                              className="mt-2"
                            />
                          )}
                        </div>
                        <Input
                          type="number"
                          placeholder="Giá trị (0-100)"
                          value={profileItem.value.toString()}
                          onChange={(e) => {
                            const newProfile = [...formData.profile];
                            newProfile[index] = { ...newProfile[index], value: parseFloat(e.target.value || '0') };
                            setFormData({ ...formData, profile: newProfile });
                          }}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newProfile = formData.profile.filter((_, i) => i !== index);
                            setFormData({ ...formData, profile: newProfile });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (formData.profile.length >= MAX_FLAVOR_PROFILES) {
                          toast.error(`Chỉ được phép tối đa ${MAX_FLAVOR_PROFILES} hương vị.`);
                          return;
                        }
                        setFormData({ ...formData, profile: [...formData.profile, { name: '', value: 0 }] });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm dòng hương vị
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Danh mục</Label>
                  {!categories || categories.length === 0 ? (
                    <p className="text-sm text-foreground/60">
                      Chưa có danh mục nào. Vui lòng tạo danh mục trước.
                    </p>
                  ) : (
                    <div className="space-y-2 border rounded-md p-4">
                      {categories.map((category) => {
                        const isSelected = formData.categories.some(c => c.id === category.id);
                        return (
                          <div key={Number(category.id)} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={isSelected}
                              onCheckedChange={() => handleCategoryToggle(category)}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {category.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <PairingFoodSelection
                  selectedPairings={formData.paring}
                  onSelectionChange={(newPairings) => setFormData({ ...formData, paring: newPairings })}
                />

                <TastingNoteSelection
                  selectedTastingNotes={formData.tasting}
                  onSelectionChange={(newTastingNotes) => setFormData({ ...formData, tasting: newTastingNotes })}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave} 
                    disabled={addProduct.isPending || updateProduct.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {addProduct.isPending || updateProduct.isPending ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={addProduct.isPending || updateProduct.isPending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {products.length === 0 ? (
              <p className="text-center text-foreground/60 py-8">
                Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.
              </p>
            ) : (
              products.map((product) => (
                <Card key={Number(product.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {product.imageUrl && (
                        <img
                          src={getImagePreviewUrl(product.imageUrl)}
                          alt={product.name}
                          className="h-24 w-24 rounded object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-foreground/70 text-sm mt-1 line-clamp-2">{product.description}</p>
                        <p className="text-primary font-medium mt-2">
                          {Number(product.price).toLocaleString('vi-VN')} VNĐ
                        </p>
                        {product.categories && product.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {product.categories.map((category, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {product.paring && product.paring.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-xs font-semibold text-foreground/70">Kết hợp:</span>
                            {product.paring.map((pairing, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {pairing.icon} {pairing.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {product.tasting && product.tasting.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-xs font-semibold text-foreground/70">Hương vị:</span>
                            {product.tasting.map((tasting, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tasting.icon} {tasting.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          disabled={isAdding || editingProduct !== null || deleteProduct.isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm(product.id)}
                          disabled={isAdding || editingProduct !== null || deleteProduct.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm !== null && (
                <>
                  Bạn có chắc chắn muốn xóa sản phẩm "{products.find(p => p.id === deleteConfirm)?.name}"? Hành động này không thể hoàn tác.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProduct.isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm !== null && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
