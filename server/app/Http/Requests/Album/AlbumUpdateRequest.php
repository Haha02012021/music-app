<?php

namespace App\Http\Requests\Album;

use App\Http\Requests\CustomRequest;

class AlbumUpdateRequest extends CustomRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'exists:albums,id'],
            'title' => ['string', 'not_regex:/`/i'],
            'released_at' => ['date'],
            'song_ids' => ['array'],
            'thumbnail' => ['file', 'mimes:jpeg,png', 'mimetypes:image/jpeg,image/png'],
            'description' => ['string', 'max:255'],
        ];
    }
}
