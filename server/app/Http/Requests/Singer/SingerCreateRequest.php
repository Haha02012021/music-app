<?php

namespace App\Http\Requests\Singer;

use App\Http\Requests\CustomRequest;

class SingerCreateRequest extends CustomRequest
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
            'name' => ['required', 'string', 'max:60'],
            'thumbnail' => ['file', 'mimes:png,jpg,jpeg'],
            'name' => ['string', 'max:60'],
            'bio' => ['text'],
        ];
    }
}
