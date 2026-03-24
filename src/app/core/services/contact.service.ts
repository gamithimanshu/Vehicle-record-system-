import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  addDoc,
  Firestore,
  collection,
  serverTimestamp,
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

interface ContactApiResponse {
  message: string;
  savedToCollection?: boolean;
  submissionId?: string | null;
  emailSent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly firestore = inject(Firestore);
  private readonly contactCollection = collection(this.firestore, 'contactMessages');

  async sendMessage(payload: ContactPayload) {
    try {
      const response = await firstValueFrom(
        this.http.post<ContactApiResponse>('/api/contact', payload)
      );

      if (response.savedToCollection === false) {
        const savedInFallback = await this.saveFallbackSubmission(payload, 'sent');

        if (!savedInFallback) {
          return {
            ...response,
            message:
              'Your message was sent successfully, but it could not be saved to the contact collection.'
          };
        }
      }

      return response;
    } catch (error: any) {
      await this.saveFallbackSubmission(payload, 'failed', this.getErrorMessage(error));

      throw error;
    }
  }

  private async saveFallbackSubmission(
    payload: ContactPayload,
    emailStatus: 'failed' | 'sent',
    emailError?: string
  ) {
    try {
      await addDoc(this.contactCollection, {
        ...payload,
        emailError: emailError || null,
        emailStatus,
        emailedAt: emailStatus === 'sent' ? serverTimestamp() : null,
        source: 'frontend-fallback',
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return true;
    } catch {
      return false;
    }
  }

  private getErrorMessage(error: any) {
    return (
      error?.error?.message ||
      error?.message ||
      'Failed to send your message. Please try again.'
    );
  }
}
