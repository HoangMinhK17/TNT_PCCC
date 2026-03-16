import React, { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet-async';
import { getAllIntroduction } from '../utils/introductApi';

const SEO = ({ title, description, keywords, image, url, type = 'website', schema }) => {
    const [introduction, setIntroduction] = useState(null);
    useEffect(() => {
        const fetchIntroduction = async () => {
            const res = await getAllIntroduction();
            setIntroduction(Array.isArray(res) ? (res[0] ?? null) : res);
        };
        fetchIntroduction();
    }, []);
    const siteTitle = introduction?.name || '';
    const defaultDescription = introduction?.description?.descriptionName || '';
    const defaultKeywords = introduction?.title?.titleName || '';
    const defaultImage = introduction?.image[0] || '';
    const siteUrl = introduction?.url || '';

    const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords || defaultKeywords;
    const metaImage = image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`;
    const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

    return (
        <Helmet>
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />

            <meta property="og:type" content={type} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={metaUrl} />
            <meta property="twitter:title" content={metaTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={metaImage} />

            <link rel="canonical" href={metaUrl} />

            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
