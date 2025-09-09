'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Sparkles, User } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useCreateCharacter, useUploadImage, useLocalPreview, useAllCharacters } from '@/shared/hooks';
import type { CreateCharacterRequest } from '@/shared/types/api';

interface CharacterCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  prompt: string;
  thumbnail?: string;
}

export function CharacterCreateModal({ isOpen, onClose }: CharacterCreateModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>();

  const createCharacterMutation = useCreateCharacter();
  const uploadImageMutation = useUploadImage();
  const { createPreview } = useLocalPreview();
  const { refetch: refetchCharacters } = useAllCharacters();

  const watchedName = watch('name', '');

  // 파일 선택 핸들러
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('📁 파일이 선택되지 않음');
      return;
    }

    console.log('📁 파일 선택됨:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('❌ 파일 크기 초과:', file.size, 'bytes');
      alert('파일 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    // 파일 형식 검증
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ 지원하지 않는 파일 형식:', file.type);
      alert('PNG, JPEG, WEBP, AVIF 형식의 이미지만 업로드 가능합니다.');
      return;
    }

    console.log('✅ 파일 검증 통과');
    setSelectedFile(file);
    
    // 로컬 미리보기 생성
    const preview = await createPreview(file);
    setPreviewUrl(preview);
    console.log('🖼️ 미리보기 URL 생성됨');
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: FormData) => {
    try {
      console.log('🎭 캐릭터 생성 시작:', data);
      let thumbnailUrl = '';

      // 이미지가 선택된 경우 업로드
      if (selectedFile) {
        console.log('📸 이미지 업로드 시작:', {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type
        });
        
        const uploadResult = await uploadImageMutation.mutateAsync(selectedFile);
        thumbnailUrl = uploadResult.url;
        
        console.log('✅ 이미지 업로드 성공:', {
          url: uploadResult.url,
          filename: uploadResult.filename,
          size: uploadResult.size,
          mimetype: uploadResult.mimetype
        });
      } else {
        console.log('ℹ️ 이미지 없이 캐릭터 생성');
      }

      // 캐릭터 생성
      const characterData: CreateCharacterRequest = {
        name: data.name,
        prompt: data.prompt,
        thumbnail: thumbnailUrl || undefined,
      };

      console.log('🎭 캐릭터 데이터 생성:', characterData);
      
      const result = await createCharacterMutation.mutateAsync(characterData);
      
      console.log('🎉 캐릭터 생성 성공:', result);
      
      // 캐릭터 목록 새로고침
      console.log('🔄 캐릭터 목록 새로고침 중...');
      await refetchCharacters();
      console.log('✅ 캐릭터 목록 새로고침 완료');
      
      // 성공 시 모달 닫기 및 폼 초기화
      handleClose();
    } catch (error) {
      console.error('❌ 캐릭터 생성 실패:', error);
    }
  };

  // 모달 닫기 핸들러
  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setPreviewUrl('');
    onClose();
  };

  const isLoading = createCharacterMutation.isPending || uploadImageMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            새로운 캐릭터 만들기
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 캐릭터 이름 */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              📝 캐릭터 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="예: 친근한 로봇, 지혜로운 현자..."
              {...register('name', {
                required: '캐릭터 이름을 입력해주세요',
                minLength: {
                  value: 2,
                  message: '이름은 최소 2자 이상이어야 합니다',
                },
                maxLength: {
                  value: 50,
                  message: '이름은 최대 50자까지 가능합니다',
                },
              })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* 캐릭터 성격 (프롬프트) */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">
              🎭 캐릭터 성격 (프롬프트) <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="prompt"
              placeholder="캐릭터의 성격, 말투, 특징을 자세히 설명해주세요.&#10;예: 당신은 친근하고 유머러스한 로봇입니다. 항상 긍정적이고 도움이 되는 조언을 제공하며, 가끔 로봇다운 귀여운 말실수를 합니다."
              rows={4}
              {...register('prompt', {
                required: '캐릭터 성격을 입력해주세요',
                minLength: {
                  value: 10,
                  message: '성격 설명은 최소 10자 이상이어야 합니다',
                },
                maxLength: {
                  value: 1000,
                  message: '성격 설명은 최대 1000자까지 가능합니다',
                },
              })}
              className={errors.prompt ? 'border-red-500' : ''}
            />
            {errors.prompt && (
              <p className="text-sm text-red-500">{errors.prompt.message}</p>
            )}
          </div>

          {/* 썸네일 이미지 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              🖼️ 썸네일 이미지 (선택사항)
            </Label>
            
            <div className="flex items-center gap-4">
              {/* 미리보기 */}
              <Avatar className="w-20 h-20 ring-2 ring-muted">
                <AvatarImage src={previewUrl || undefined} alt="캐릭터 미리보기" />
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {watchedName.charAt(0) || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>

              {/* 파일 선택 */}
              <div className="flex-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('thumbnail-input')?.click()}
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4" />
                      파일 선택
                    </Button>
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl('');
                        }}
                      >
                        제거
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    PNG, JPEG, WEBP, AVIF • 최대 5MB
                  </p>
                  
                  {selectedFile && (
                    <p className="text-xs text-green-600">
                      선택됨: {selectedFile.name}
                    </p>
                  )}
                </div>

                <input
                  id="thumbnail-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  생성 중...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  캐릭터 만들기
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
