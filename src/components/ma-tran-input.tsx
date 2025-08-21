import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type Props = {
  n: number;
  m: number;
  p: number;
  values: number[][];
  onChange: (r: number, c: number, v: number) => void;
};

function isValidMatrix(values: number[][], p: number): boolean {
  const flat = values.flat();
  const unique = new Set(flat);
  for (let i = 1; i <= p; i++) {
    if (!unique.has(i)) return false;
  }
  return true;
}

export default function MaTranInput({ n, m, p, values, onChange }: Props) {
  const valid = isValidMatrix(values, p);

  return (
    <>
      <Grid container spacing={1}>
        {Array.from({ length: n }).map((_, r) => (
          <Grid item xs={12} key={r}>
            <Grid container spacing={1}>
              {Array.from({ length: m }).map((__, c) => {
                const v = values[r]?.[c] ?? 1;
                const error = typeof v !== 'number' || isNaN(v) || v < 1 || v > p;
                return (
                  <Grid item key={`${r}-${c}`}>
                    <TextField
                      type="number"
                      size="small"
                      value={v}
                      onChange={(e) => onChange(r, c, Number(e.target.value))}
                      inputProps={{ min: 1, max: p, style: { width: 72 } }}
                      error={error}
                      helperText={error ? `1..${p}` : ' '}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        ))}
      </Grid>

      {!valid && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Ma trận phải chứa đầy đủ các số từ 1 đến {p}
        </Typography>
      )}
    </>
  );
}
