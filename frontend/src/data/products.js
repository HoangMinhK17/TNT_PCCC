
import bg1 from '../uploads/products/product1.jpg';
import bg2 from '../uploads/products/product2.jpg';
import bg3 from '../uploads/products/product3.jpg';
import bg4 from '../uploads/products/product4.jpg';
import bg5 from '../uploads/products/product5.jpg';
import bg6 from '../uploads/products/product6.jpg';

export const products = [
    {
        id: 1,
        name: 'Bình chữa cháy ABC',
        price: '1,000,000 VND',
        images: [bg1, bg2, bg3],
        category: 'Thiết bị chữa cháy',
        description: 'Bình bột chữa cháy đa năng, thích hợp cho nhiều loại đám cháy.',
        detail: 'Bình chữa cháy bột ABC là loại bình chữa cháy xách tay, dùng để chữa các đám cháy chất rắn, lỏng, khí và thiết bị điện hạ thế. Bột chữa cháy không độc, không dẫn điện, có hiệu quả cao. Bình được thiết kế nhỏ gọn, dễ sử dụng, phù hợp cho gia đình, văn phòng, nhà xưởng.',
        isFeatured: true
    },
    {
        id: 2,
        name: 'Hộp cứu hỏa vách tường',
        price: '2,000,000 VND',
        images: [bg2, bg3, bg4],
        category: 'Thiết bị chữa cháy',
        description: 'Hộp đựng vòi chữa cháy gắn tường, bền đẹp.',
        detail: 'Hộp cứu hỏa vách tường được làm bằng tôn sơn tĩnh điện, có độ bền cao, chống rỉ sét. Hộp dùng để đựng van góc, lăng phun và cuộn vòi chữa cháy. Thiết kế thẩm mỹ, dễ dàng lắp đặt và sử dụng trong các tòa nhà, chung cư, nhà máy.',
        isFeatured: true
    },
    {
        id: 3,
        name: 'Đèn Exit thoát hiểm',
        price: '1,500,000 VND',
        images: [bg3, bg4, bg5],
        category: 'Hệ thống báo cháy',
        description: 'Đèn chỉ dẫn lối thoát hiểm khi có sự cố.',
        detail: 'Đèn Exit thoát hiểm là thiết bị quan trọng trong hệ thống PCCC, giúp chỉ dẫn lối thoát nạn an toàn khi xảy ra sự cố cháy nổ hoặc mất điện. Đèn sử dụng công nghệ LED tiết kiệm điện, pin sạc dự phòng đảm bảo hoạt động liên tục trong thời gian dài.',
        isFeatured: false
    },
    {
        id: 4,
        name: 'Mặt nạ phòng độc 3M',
        price: '1,800,000 VND',
        images: [bg4, bg5, bg6],
        category: 'Bảo hộ lao động',
        description: 'Mặt nạ lọc khói độc, bảo vệ hô hấp.',
        detail: 'Mặt nạ phòng độc 3M được thiết kế để bảo vệ người sử dụng khỏi các loại khí độc, khói, bụi mịn. Mặt nạ làm bằng chất liệu silicon mềm mại, ôm khít khuôn mặt, tạo cảm giác thoải mái khi đeo. Phin lọc than hoạt tính có khả năng hấp thụ độc tố cao.',
        isFeatured: false
    },
    {
        id: 5,
        name: 'Vòi chữa cháy D50',
        price: '2,200,000 VND',
        images: [bg5, bg6, bg1],
        category: 'Thiết bị chữa cháy',
        description: 'Vòi rồng áp lực cao, chịu lực tốt.',
        detail: 'Vòi chữa cháy D50 là loại vòi đẩy dùng để dẫn nước từ van chữa cháy đến đám cháy. Vòi được làm bằng sợi tổng hợp, bên trong tráng cao su, chịu được áp lực nước cao và độ mài mòn tốt. Khớp nối nhôm chắc chắn, dễ dàng thao tác.',
        isFeatured: true
    },
    {
        id: 6,
        name: 'Đầu báo khói quang',
        price: '1,200,000 VND',
        images: [bg6, bg1, bg2],
        category: 'Hệ thống báo cháy',
        description: 'Cảm biến khói độ nhạy cao, phát hiện cháy sớm.',
        detail: 'Đầu báo khói quang sử dụng công nghệ cảm biến quang học để phát hiện khói, giúp cảnh báo sớm nguy cơ cháy nổ. Thiết bị hoạt động ổn định, độ tin cậy cao, ít báo giả. Thích hợp lắp đặt tại các khu vực như phòng ngủ, phòng khách, văn phòng, kho bãi.',
        isFeatured: true
    },
    {
        id: 7,
        name: 'Quần áo chịu nhiệt',
        price: '3,500,000 VND',
        images: [bg1, bg2, bg3],
        category: 'Bảo hộ lao động',
        description: 'Bộ quần áo tráng nhôm chịu nhiệt độ cao.',
        detail: 'Bộ quần áo chịu nhiệt được làm từ vải tráng nhôm, có khả năng phản xạ nhiệt tốt, bảo vệ người lính cứu hỏa khi tiếp cận đám cháy. Bộ trang phục bao gồm quần, áo, mũ, găng tay và ủng chịu nhiệt, đảm bảo an toàn tối đa.',
        isFeatured: true
    },
    {
        id: 8,
        name: 'Chuông báo cháy',
        price: '500,000 VND',
        images: [bg3, bg4, bg5],
        category: 'Hệ thống báo cháy',
        description: 'Chuông báo động âm lượng lớn.',
        detail: 'Chuông báo cháy là thiết bị phát tín hiệu âm thanh cảnh báo khi có sự cố cháy nổ. Chuông có âm lượng lớn, vang xa, giúp mọi người trong khu vực nguy hiểm nhanh chóng nhận biết và sơ tán. Thiết kế bền bỉ, chịu được môi trường khắc nghiệt.',
        isFeatured: false
    }
];
