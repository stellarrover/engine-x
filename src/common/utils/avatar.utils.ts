import { createCanvas } from 'canvas';

export const COLORS = [
  '#2F54EB',
  '#4AA1BB',
  '#3E845F',
  '#F09D4B',
  '#CC452C',
  '#4F4AA0',
  '#1C2C49',
  'linear-gradient(45deg, #8E4BFB 0%, #2F54EB 100%)',
] as const;

export type ColorsType = (typeof COLORS)[number];

export const AvatarUtils = {
  drawAvatar(
    canvas: HTMLCanvasElement,
    text: string,
    color: ColorsType,
    heightDiff: number = 0,
    fontSize: number = 40,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // 步骤 3: 绘制方形
    if (color.includes('linear-gradient')) {
      const gradient = ctx.createLinearGradient(
        0,
        canvas.height,
        canvas.width,
        0,
      );
      gradient.addColorStop(0, '#8E4BFB');
      gradient.addColorStop(1, '#2F54EB');
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = color;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `500 ${fontSize * devicePixelRatio}px Poppins`;

    ctx.fillStyle = '#ffffff';

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(
      text.toUpperCase() || '-',
      canvas.width / 2,
      (canvas.height + heightDiff) / 2,
      canvas.width,
    );
  },
  generateAvatar(text: string, canvasSize: number = 256): Buffer {
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');

    // 随机选择背景色
    const colorIndex = Math.floor(Math.random() * COLORS.length);
    const background = COLORS[colorIndex];

    // 检查是否为渐变色
    if (background.includes('linear-gradient')) {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, '#8E4BFB'); // 颜色渐变起点
      gradient.addColorStop(1, '#2F54EB'); // 颜色渐变终点
      ctx.fillStyle = gradient;
    } else {
      // 单一颜色
      ctx.fillStyle = background;
    }

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 文字样式
    const fontSize = Math.floor(canvasSize / 2); // 字体大小
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(
      text.substring(0, 1).toUpperCase(),
      canvasSize / 2,
      canvasSize / 2,
    );

    return canvas.toBuffer('image/png'); // 返回PNG格式的二进制数据
  },
};
