
export const UI_THEMES = [
    {
        id: 'corporate-red',
        label: 'Corporate Red',
        labelVn: 'Đỏ Chuyên Nghiệp',
        description: 'Phong cách doanh nghiệp, mạnh mẽ',
        tag: 'Mặc định',
        tagColor: '#D32F2F',
        previewColors: {
            header: '#D32F2F',
            bg: '#ffffff',
            card: '#fff5f5',
            accent: '#D32F2F',
            text: '#1a1a2e',
        },
        layout: {
            news: 'magazine',          // 1 bài lớn + 2 nhỏ phải
            product: 'grid-4',         // 4 card đứng
            service: 'card-image',     // Card có ảnh
            project: 'masonry',        // Lưới thẻ dự án bất đối xứng
            leader: 'grid-carousel',   // Băng chuyền cuộn ngang
            partner: 'marquee',      // Lưới tĩnh viền bao quanh
            section_style: 'sharp',    // Vuông (ít bo góc)
            section_spacing: 'normal', // Khoảng cách bình thường
            header: 'classic',         // Menu sát logo, khối chữ nhật tràn viền
        },
        variables: {
            '--theme-bg': '#ffffff',
            '--theme-surface': '#fff5f5',
            '--theme-primary': '#D32F2F',
            '--theme-primary-hover': '#B71C1C',
            '--theme-primary-light': '#ffebee',
            '--theme-secondary': '#1a1a2e',
            '--theme-text': '#1a1a2e',
            '--theme-text-muted': '#6b7280',
            '--theme-border': '#e5e7eb',
            '--theme-border-hover': '#D32F2F',
            '--theme-radius': '8px',
            '--theme-radius-lg': '16px',
            '--theme-font': "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
            '--theme-font-heading': "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
            '--theme-shadow': '0 4px 16px rgba(211,47,47,0.10)',
            '--theme-shadow-hover': '0 8px 32px rgba(211,47,47,0.18)',
            '--theme-btn-bg': '#D32F2F',
            '--theme-btn-text': '#ffffff',
            '--theme-btn-radius': '8px',
            '--theme-btn-shadow': '0 2px 8px rgba(211,47,47,0.3)',
            '--theme-card-bg': '#ffffff',
            '--theme-card-shadow': '0 2px 12px rgba(0,0,0,0.08)',
            '--theme-card-radius': '12px',
            '--theme-header-bg': '#D32F2F',
            '--theme-header-text': '#ffffff',
            '--theme-footer-bg': '#1a1a2e',
            '--theme-footer-text': '#e5e7eb',
            '--theme-section-alt': '#fff5f5',
            '--theme-input-bg': '#ffffff',
            '--theme-input-border': '#e5e7eb',
            '--theme-input-focus': '#D32F2F',
            '--theme-divider': '#fce4e4',
            '--theme-overlay': 'rgba(211,47,47,0.06)',
        }
    },
    {
        id: 'ocean-blue',
        label: 'Ocean Blue',
        labelVn: 'Xanh Đại Dương',
        description: 'Hiện đại, năng động, tin cậy',
        tag: 'Hiện đại',
        tagColor: '#1565C0',
        previewColors: {
            header: '#1565C0',
            bg: '#f0f7ff',
            card: '#e3f2fd',
            accent: '#1976D2',
            text: '#0d2137',
        },
        layout: {
            news: 'grid',              // 3 card đứng đều nhau
            product: 'grid-3',         // 3 card lớn hơn
            service: 'card-image',      // Icon + tên + mô tả (không ảnh)
            project: 'slider-3d',      // Slide lướt hiệu ứng xoay góc
            leader: 'card-modern',     // Lưới tĩnh, thẻ ảnh lãnh đạo nổi nhẹ
            partner: 'marquee',        // Viền logo chạy liên tục năng động
            section_style: 'rounded',  // Bo góc vừa
            section_spacing: 'normal',
            header: 'floating',        // Khối bo tròn lơ lửng, menu giữa
        },
        variables: {
            '--theme-bg': '#f0f7ff',
            '--theme-surface': '#e3f2fd',
            '--theme-primary': '#1565C0',
            '--theme-primary-hover': '#0d47a1',
            '--theme-primary-light': '#e3f2fd',
            '--theme-secondary': '#0d2137',
            '--theme-text': '#0d2137',
            '--theme-text-muted': '#5c7a9e',
            '--theme-border': '#b3d1f0',
            '--theme-border-hover': '#1565C0',
            '--theme-radius': '10px',
            '--theme-radius-lg': '20px',
            '--theme-font': "'Inter', 'Nunito', system-ui, sans-serif",
            '--theme-font-heading': "'Nunito', 'Inter', system-ui, sans-serif",
            '--theme-shadow': '0 4px 20px rgba(21,101,192,0.12)',
            '--theme-shadow-hover': '0 8px 32px rgba(21,101,192,0.22)',
            '--theme-btn-bg': '#1565C0',
            '--theme-btn-text': '#ffffff',
            '--theme-btn-radius': '10px',
            '--theme-btn-shadow': '0 2px 8px rgba(21,101,192,0.35)',
            '--theme-card-bg': '#ffffff',
            '--theme-card-shadow': '0 2px 16px rgba(21,101,192,0.10)',
            '--theme-card-radius': '14px',
            '--theme-header-bg': '#1565C0',
            '--theme-header-text': '#ffffff',
            '--theme-footer-bg': '#0d2137',
            '--theme-footer-text': '#b3d1f0',
            '--theme-section-alt': '#e8f4fd',
            '--theme-input-bg': '#ffffff',
            '--theme-input-border': '#b3d1f0',
            '--theme-input-focus': '#1565C0',
            '--theme-divider': '#c8e3f8',
            '--theme-overlay': 'rgba(21,101,192,0.06)',
        }
    },
    {
        id: 'forest-green',
        label: 'Forest Green',
        labelVn: 'Xanh Rừng',
        description: 'Thiên nhiên, bền vững, tươi mát',
        tag: 'Tự nhiên',
        tagColor: '#2E7D32',
        previewColors: {
            header: '#2E7D32',
            bg: '#f1f8f1',
            card: '#e8f5e9',
            accent: '#388E3C',
            text: '#1b3a1d',
        },
        layout: {
            news: 'list',              // Danh sách ngang: ảnh trái, text phải
            product: 'list-horizontal',         // 3 card lớn
            service: 'card-image',     // Card có ảnh
            project: 'slider-3d',   // Lưới tĩnh, info đổ bóng nằm trong ảnh dự án
            leader: 'circle-avatar',   // Thẻ ban quản trị dùng ảnh tròn gần gũi
            partner: 'logo-static',    // Logo đối tác xếp lưới nhưng ko viền trống
            section_style: 'rounded',
            section_spacing: 'airy',   // Khoảng cách rộng rãi
            header: 'boxed',           // Khối bo góc nhẹ, lơ lửng, menu phải
        },
        variables: {
            '--theme-bg': '#f1f8f1',
            '--theme-surface': '#e8f5e9',
            '--theme-primary': '#2E7D32',
            '--theme-primary-hover': '#1b5e20',
            '--theme-primary-light': '#e8f5e9',
            '--theme-secondary': '#1b3a1d',
            '--theme-text': '#1b3a1d',
            '--theme-text-muted': '#52795a',
            '--theme-border': '#a5d6a7',
            '--theme-border-hover': '#2E7D32',
            '--theme-radius': '6px',
            '--theme-radius-lg': '14px',
            '--theme-font': "'Lora'",
            '--theme-font-heading': "'Lora'",
            '--theme-shadow': '0 4px 18px rgba(46,125,50,0.12)',
            '--theme-shadow-hover': '0 8px 30px rgba(46,125,50,0.20)',
            '--theme-btn-bg': '#2E7D32',
            '--theme-btn-text': '#ffffff',
            '--theme-btn-radius': '6px',
            '--theme-btn-shadow': '0 2px 8px rgba(46,125,50,0.30)',
            '--theme-card-bg': '#ffffff',
            '--theme-card-shadow': '0 2px 12px rgba(46,125,50,0.10)',
            '--theme-card-radius': '10px',
            '--theme-header-bg': '#2E7D32',
            '--theme-header-text': '#ffffff',
            '--theme-footer-bg': '#1b3a1d',
            '--theme-footer-text': '#a5d6a7',
            '--theme-section-alt': '#e8f5e9',
            '--theme-input-bg': '#ffffff',
            '--theme-input-border': '#a5d6a7',
            '--theme-input-focus': '#2E7D32',
            '--theme-divider': '#c8e6c9',
            '--theme-overlay': 'rgba(46,125,50,0.06)',
        }
    },
    {
        id: 'midnight-dark',
        label: 'Midnight Dark',
        labelVn: 'Đêm Sang Trọng',
        description: 'Dark mode cao cấp, hiện đại',
        tag: 'Dark Mode',
        tagColor: '#7c3aed',
        previewColors: {
            header: '#1e1b4b',
            bg: '#0f0f1a',
            card: '#1e1b4b',
            accent: '#7c3aed',
            text: '#e2e8f0',
        },
        layout: {
            news: 'magazine',          // Magazine layout
            product: 'grid-3',         // 3 card lớn
            service: 'card-image',      // Icon card
            project: 'glow-cards',     // Viền neon bao quanh grid card
            leader: 'dark-glass',      // Hiệu ứng Glassmorphism đổ bóng làm mịn ảnh
            partner: 'logo-opacity',   // Logo bị xám mờ và hiện rực nếu hover chuột
            section_style: 'pill',     // Bo góc nhiều (pill-shape)
            section_spacing: 'compact', // Compact
            header: 'floating',        // Khối bo tròn lơ lửng, menu giữa
        },
        variables: {
            '--theme-bg': '#0f0f1a',
            '--theme-surface': '#1e1b4b',
            '--theme-primary': '#7c3aed',
            '--theme-primary-hover': '#6d28d9',
            '--theme-primary-light': '#2d2060',
            '--theme-secondary': '#a78bfa',
            '--theme-text': '#e2e8f0',
            '--theme-text-muted': '#94a3b8',
            '--theme-border': '#2d2060',
            '--theme-border-hover': '#7c3aed',
            '--theme-radius': '12px',
            '--theme-radius-lg': '20px',
            '--theme-font': "'Space Grotesk', 'Inter', system-ui, sans-serif",
            '--theme-font-heading': "'Space Grotesk', 'Inter', system-ui, sans-serif",
            '--theme-shadow': '0 4px 24px rgba(124,58,237,0.20)',
            '--theme-shadow-hover': '0 8px 40px rgba(124,58,237,0.35)',
            '--theme-btn-bg': '#7c3aed',
            '--theme-btn-text': '#ffffff',
            '--theme-btn-radius': '12px',
            '--theme-btn-shadow': '0 0 16px rgba(124,58,237,0.45)',
            '--theme-card-bg': '#1e1b4b',
            '--theme-card-shadow': '0 4px 24px rgba(0,0,0,0.40)',
            '--theme-card-radius': '16px',
            '--theme-header-bg': '#13111f',
            '--theme-header-text': '#e2e8f0',
            '--theme-footer-bg': '#080810',
            '--theme-footer-text': '#94a3b8',
            '--theme-section-alt': '#161428',
            '--theme-input-bg': '#1e1b4b',
            '--theme-input-border': '#2d2060',
            '--theme-input-focus': '#7c3aed',
            '--theme-divider': '#2d2060',
            '--theme-overlay': 'rgba(124,58,237,0.08)',
        }
    },
    {
        id: 'warm-gold',
        label: 'Warm Gold',
        labelVn: 'Vàng Cao Cấp',
        description: 'Sang trọng, premium, đẳng cấp',
        tag: 'Luxury',
        tagColor: '#b45309',
        previewColors: {
            header: '#92400e',
            bg: '#fffbeb',
            card: '#fef3c7',
            accent: '#d97706',
            text: '#1c1408',
        },
        layout: {
            news: 'magazine',           // Magazine style
            product: 'list-horizontal', // Card ngang: ảnh trái, info phải
            service: 'card-image',       // Icon card
            project: 'classic-grid',    // Lưới dự án đóng vai kẻ khung trang trọng
            leader: 'elegant-profile',  // Hồ sơ lãnh đạo nét chữ mạ vàng thanh mảnh
            partner: 'marquee',  // Bộ logo đối tác được tinh chỉnh hiệu ứng mạ vàng
            section_style: 'sharp',
            section_spacing: 'airy',
            header: 'floating',   // Khối chữ nhật tràn viền, menu phải
        },
        variables: {
            '--theme-bg': '#fffbeb',
            '--theme-surface': '#fef3c7',
            '--theme-primary': '#d97706',
            '--theme-primary-hover': '#b45309',
            '--theme-primary-light': '#fef3c7',
            '--theme-secondary': '#1c1408',
            '--theme-text': '#1c1408',
            '--theme-text-muted': '#78614a',
            '--theme-border': '#f5d97a',
            '--theme-border-hover': '#d97706',
            '--theme-radius': '4px',
            '--theme-radius-lg': '8px',
            '--theme-font': "'Arial', serif",
            '--theme-font-heading': "'Arial', serif",
            '--theme-shadow': '0 4px 20px rgba(217,119,6,0.14)',
            '--theme-shadow-hover': '0 8px 32px rgba(217,119,6,0.24)',
            '--theme-btn-bg': '#d97706',
            '--theme-btn-text': '#ffffff',
            '--theme-btn-radius': '4px',
            '--theme-btn-shadow': '0 2px 8px rgba(217,119,6,0.35)',
            '--theme-card-bg': '#fffdf5',
            '--theme-card-shadow': '0 2px 12px rgba(217,119,6,0.12)',
            '--theme-card-radius': '8px',
            '--theme-header-bg': '#92400e',
            '--theme-header-text': '#fef3c7',
            '--theme-footer-bg': '#1c1408',
            '--theme-footer-text': '#f5d97a',
            '--theme-section-alt': '#fef3c7',
            '--theme-input-bg': '#fffdf5',
            '--theme-input-border': '#f5d97a',
            '--theme-input-focus': '#d97706',
            '--theme-divider': '#fde68a',
            '--theme-overlay': 'rgba(217,119,6,0.06)',
        }
    },
    {
        id: 'pure-minimal',
        label: 'Pure Minimal',
        labelVn: 'Tối Giản',
        description: 'Tinh tế, sạch sẽ, tập trung nội dung',
        tag: 'Minimal',
        tagColor: '#374151',
        previewColors: {
            header: '#111827',
            bg: '#ffffff',
            card: '#f9fafb',
            accent: '#374151',
            text: '#111827',
        },
        layout: {
            news: 'list',               // List ngang
            product: 'list-horizontal', // Card ngang
            service: 'list',            // Full-width list
            project: 'minimal-grid',    // Thuần túy không border không boxshadow - tập trung ảnh
            leader: 'circle-avatar',       // Highlight chức danh, giấu hình để gọn trang web
            partner: 'logo-mono',       // Logo luôn full màu đen/xám tăng độ tương phản
            section_style: 'sharp',
            section_spacing: 'compact',
            header: 'minimal',         // Khối phẳng, không viền mờ, menu giữa
        },
        variables: {
            '--theme-bg': '#ffffff',
            '--theme-surface': '#f9fafb',
            '--theme-primary': '#111827',
            '--theme-primary-hover': '#374151',
            '--theme-primary-light': '#f3f4f6',
            '--theme-secondary': '#374151',
            '--theme-text': '#111827',
            '--theme-text-muted': '#6b7280',
            '--theme-border': '#e5e7eb',
            '--theme-border-hover': '#374151',
            '--theme-radius': '2px',
            '--theme-radius-lg': '6px',
            '--theme-font': "'Times New Roman', Times, serif",
            '--theme-font-heading': "'Times New Roman', Times, serif",
            '--theme-shadow': '0 1px 4px rgba(0,0,0,0.08)',
            '--theme-shadow-hover': '0 4px 16px rgba(0,0,0,0.12)',
            '--theme-btn-bg': '#111827',
            '--theme-btn-text': '#ffffff',
            '--theme-btn-radius': '2px',
            '--theme-btn-shadow': 'none',
            '--theme-card-bg': '#ffffff',
            '--theme-card-shadow': '0 1px 3px rgba(0,0,0,0.08)',
            '--theme-card-radius': '4px',
            '--theme-header-bg': '#111827',
            '--theme-header-text': '#f9fafb',
            '--theme-footer-bg': '#111827',
            '--theme-footer-text': '#9ca3af',
            '--theme-section-alt': '#f9fafb',
            '--theme-input-bg': '#ffffff',
            '--theme-input-border': '#d1d5db',
            '--theme-input-focus': '#111827',
            '--theme-divider': '#e5e7eb',
            '--theme-overlay': 'rgba(0,0,0,0.04)',
        }
    },
    {
        id: 'ai-teal',
        label: 'AI Teal',
        labelVn: 'AI Hiện Đại',
        description: 'Phong cách AI hiện đại, teal gradient',
        tag: 'AI Mới',
        tagColor: '#0d9488',
        previewColors: {
            header: 'rgba(255,255,255,0.9)',
            bg: '#F9FAFB',
            card: 'rgba(255,255,255,0.95)',
            accent: '#55CCC2',
            text: '#011E1A',
        },
        layout: {
            news: 'grid',              // 3 card đứng đều
            product: 'ai-teal',         // 3 card lớn bo tròn nhiều
            service: 'card-image',     // Card có ảnh
            project: 'classic-grid',   // Lưới dự án info gradient bên trong
            leader: 'circle-avatar',   // Avatar tròn thân thiện kiểu AI companion
            partner: 'logo-grid',      // Lưới logo với border nhẹ
            section_style: 'pill',     // Bo góc nhiều - pill shape
            section_spacing: 'airy',   // Khoảng cách rộng rãi, thoáng đãng
            header: 'floating',        // Header nổi, kiểu pill glassmorphism
        },
        variables: {
            '--theme-bg': '#F9FAFB',
            '--theme-surface': '#FFFFFF',
            '--theme-primary': '#55CCC2',
            '--theme-primary-hover': '#45B8AE',
            '--theme-primary-light': 'rgba(85,204,194,0.15)',
            '--theme-secondary': '#FFCF4D',
            '--theme-text': '#000000ff',
            '--theme-text-muted': '#4B5563',
            '--theme-border': '#E5E7EB',
            '--theme-border-hover': '#55CCC2',
            '--theme-radius': '20px',
            '--theme-radius-lg': '24px',
            '--theme-font': "'Be Vietnam Pro', system-ui, sans-serif",
            '--theme-font-heading': "'Be Vietnam Pro', system-ui, sans-serif",
            '--theme-shadow': '0 10px 15px -3px rgba(0,0,0,0.1)',
            '--theme-shadow-hover': '-1px 4px 24px rgba(85,204,194,0.3)',
            '--theme-btn-bg': '#55CCC2',
            '--theme-btn-text': '#FFFFFF',
            '--theme-btn-radius': '9999px',
            '--theme-btn-shadow': '0 4px 20px rgba(85,204,194,0.40)',
            '--theme-card-bg': '#FFFFFF',
            '--theme-card-shadow': '0 8px 32px rgba(0,0,0,0.05)',
            '--theme-card-radius': '24px',
            '--theme-header-bg': 'rgba(255,255,255,0.90)',
            '--theme-header-text': '#011E1A',
            '--theme-footer-bg': '#011E1A',
            '--theme-footer-text': '#D1D5DB',
            '--theme-section-alt': '#FFFFFF',
            '--theme-input-bg': 'rgba(255,255,255,0.9)',
            '--theme-input-border': '#E5E7EB',
            '--theme-input-focus': '#55CCC2',
            '--theme-divider': '#FDE68A',
            '--theme-overlay': 'rgba(85,204,194,0.06)',
            '--theme-glow': '0 0 60px rgba(85,204,194,0.20)',
            '--theme-glass': 'backdrop-filter: blur(12px)',
        }
    },
];

/**
 * Backward compat mapping: map theme ID cũ sang ID mới
 */
export const THEME_COMPAT_MAP = {
    'light': 'corporate-red',
    'dark': 'midnight-dark',
    'blue': 'ocean-blue',
    'green': 'forest-green',
};

/**
 * Lấy theme object theo ID (có hỗ trợ backward compat)
 */
export const getThemeById = (id) => {
    const resolvedId = THEME_COMPAT_MAP[id] || id;
    return UI_THEMES.find(t => t.id === resolvedId) || UI_THEMES[0];
};

/**
 * Inject CSS variables của theme vào document root
 */
export const applyThemeVariables = (themeId) => {
    const theme = getThemeById(themeId);
    const root = document.documentElement;
    Object.entries(theme.variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
};
