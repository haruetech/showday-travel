/** 지금 앱(public/app.html + css/js)을 / 주소에서 그대로 보여 주고, 새 기능은 API/Supabase로 붙인다.
 *  화면을 React로 옮길 때마다 이 rewrite를 줄여 간다. */
const nextConfig = {
  async rewrites() {
    return { beforeFiles: [{ source: '/', destination: '/app.html' }] };
  },
};
export default nextConfig;
