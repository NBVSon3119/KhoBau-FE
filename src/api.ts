export type inputDto = { soHang:number; soCot:number; soP:number; maTran:number[][] };
export type BaiToanDto = {
    id: number;
    soHang: number;
    soCot: number;
    soP: number;
    maTranJson: string;
    createdAt: string;
  };
export async function nhapMaTran(dto:inputDto){
  const res = await fetch('/api/bai-toan', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(dto) });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function layBai(id:number){    
  const res = await fetch(`/api/bai-toan/${id}`);
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function layKetQua(id:number){
  const res = await fetch(`/api/bai-toan/ket-qua/${id}`, { method:'POST' });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function layDanhSach(): Promise<BaiToanDto[]> {
    const res = await fetch('/api/bai-toan/danh-sach-input');
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // trả về mảng
  }
