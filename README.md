# kylezhe.ng

My personal website made with Next.js

I use this to experiment with new stuff, so the code is pretty jank.

I'm using `@next/mdx` for mdx files. I know, I'm insane. See `next.config.mjs` for details on getting image urls and frontmatter working.


## misc
- cannot use turbopack b/c using non serializable remark plugin (javascript functions)

`transformerVariantGroup` doesn't work with postcss
 - https://github.com/unocss/unocss/issues/3192