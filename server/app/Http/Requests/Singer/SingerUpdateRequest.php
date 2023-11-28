<?php

namespace App\Http\Requests\Singer;

use App\Http\Requests\CustomRequest;

class SingerUpdateRequest extends CustomRequest
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
            'id' => ['required', 'exists:singers,id'],
            'thumbnail' => ['file', 'mimes:png,jpg,jpeg'],
            'name' => ['string', 'max:60'],
            'bio' => ['string'],
        ];
    }
}
