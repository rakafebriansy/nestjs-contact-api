import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../../models/web.model';
import { LoginUserRequest, RegisterUserRequest, UserResponse } from '../../models/user.model';

@Controller('/api/users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    async register(@Body() request: RegisterUserRequest): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.register(request);
        return {
            data: result
        };
    }

    @Post('/login')
    @HttpCode(200)
    async login(@Body() request: LoginUserRequest): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.login(request);
        return {
            data: result
        };
    }
}
