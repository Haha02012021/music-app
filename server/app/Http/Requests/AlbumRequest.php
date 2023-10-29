<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class AlbumRequest extends CustomRequest
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
            'title' => ['required', 'string'],
            'type' => [Rule::in([1, 2])],
            'released_at' => ['date'],
            'song_ids' => ['array']
        ];
    }
}
