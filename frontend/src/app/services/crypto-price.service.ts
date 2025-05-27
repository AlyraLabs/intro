import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

type TokenTicker = 'SOL' | 'OP' | 'ARB' | 'ETH' | 'ORCA' | 'JUP' | 'JTO' | 'HNT' | 'RNDR' | 'RAY' | 'PYTH' | 'SAROS' | 'mSOL' | 'AVAX' | 'BNB';

@Injectable({
  providedIn: 'root'
})
export class CryptoPriceService {
  private readonly API_URL = 'https://api.coingecko.com/api/v3';
  
  private readonly TOKEN_IDS: Record<TokenTicker, string> = {
    'SOL': 'solana',
    'OP': 'optimism',
    'ARB': 'arbitrum',
    'ETH': 'ethereum',
    'ORCA': 'orca',
    'JUP': 'jupiter-exchange-solana',
    'JTO': 'jito-governance-token',
    'HNT': 'helium',
    'RNDR': 'render-token',
    'RAY': 'raydium',
    'PYTH': 'pyth-network',
    'SAROS': 'saros-finance',
    'mSOL': 'msol',
    'AVAX': 'avalanche-2',
    'BNB': 'binancecoin'
  };

  constructor(private http: HttpClient) {}

  getTokenPriceChange(ticker: TokenTicker): Observable<number> {
    const id = this.TOKEN_IDS[ticker];
    if (!id) {
      console.error(`No ID found for token ${ticker}`);
      return of(0);
    }

    return this.http.get<any>(`${this.API_URL}/simple/price`, {
      params: {
        ids: id,
        vs_currencies: 'usd',
        include_24hr_change: 'true'
      }
    }).pipe(
      map(response => {
        if (response && response[id] && response[id].usd_24h_change !== undefined) {
          return response[id].usd_24h_change;
        }
        return 0;
      }),
      catchError(error => {
        console.error(`Error fetching price for ${ticker}:`, error);
        return of(0);
      })
    );
  }

  getAllTokenPriceChanges(): Observable<Record<TokenTicker, number>> {
    const ids = Object.values(this.TOKEN_IDS).join(',');
    
    return this.http.get<any>(`${this.API_URL}/simple/price`, {
      params: {
        ids: ids,
        vs_currencies: 'usd',
        include_24hr_change: 'true'
      }
    }).pipe(
      map(response => {
        const result: Record<TokenTicker, number> = {} as Record<TokenTicker, number>;
        Object.entries(this.TOKEN_IDS).forEach(([ticker, id]) => {
          result[ticker as TokenTicker] = response[id]?.usd_24h_change ?? 0;
        });
        return result;
      }),
      catchError(error => {
        console.error('Error fetching all prices:', error);
        return of({} as Record<TokenTicker, number>);
      })
    );
  }
} 